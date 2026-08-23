import { inflateSync } from "node:zlib";
import exifr from "exifr";

/**
 * Deterministic image file forensics, run before any model analysis.
 *
 * Generators routinely sign their own output: Stable Diffusion / A1111 embeds
 * a "parameters" tEXt chunk with the full prompt, ComfyUI embeds its workflow
 * JSON, Midjourney tags the description, and real cameras leave EXIF
 * make/model/GPS data. These are facts about the file — not heuristics — and
 * they dramatically improve detection accuracy when present.
 */

export type ForensicSignal = {
  name: string;
  detail: string;
  severity: "low" | "medium" | "high";
  pointsTo: "ai" | "human";
};

export type ImageForensics = {
  format: "png" | "jpeg" | "webp" | "unknown";
  width?: number;
  height?: number;
  /** Deterministic findings to surface in the UI. */
  signals: ForensicSignal[];
  /** Neutral facts passed to the vision model as ground truth. */
  notes: string[];
  /** Set when the file itself proves AI generation (generator metadata). */
  definitiveAi: { generator: string; evidence: string } | null;
};

/** Marker strings that identify generator metadata regardless of chunk key. */
const GENERATOR_PATTERNS: Array<{ re: RegExp; generator: string }> = [
  { re: /stable ?diffusion/i, generator: "Stable Diffusion" },
  { re: /automatic ?1111/i, generator: "Stable Diffusion (Automatic1111)" },
  { re: /comfyui/i, generator: "ComfyUI" },
  { re: /midjourney/i, generator: "Midjourney" },
  { re: /dall[·\- ]?e|openai/i, generator: "DALL-E (OpenAI)" },
  { re: /\bnui\t?tal|novelai/i, generator: "NovelAI" },
  { re: /firefly/i, generator: "Adobe Firefly" },
  { re: /ideogram/i, generator: "Ideogram" },
  { re: /leonardo\.?ai/i, generator: "Leonardo AI" },
  { re: /bing image creator|copilot/i, generator: "Bing Image Creator" },
  { re: /craiyon|dalle2?/i, generator: "Craiyon/DALL-E" },
  { re: /flux/i, generator: "Flux" },
  { re: /stablehorde/i, generator: "Stable Horde" },
  { re: /invokeai/i, generator: "InvokeAI" },
];

/** Chunk keys that generators use to store prompts/workflows in PNGs. */
const GENERATOR_CHUNK_KEYS = /^(parameters|workflow|prompt|seed|generation data|description)$/i;

const COMMON_AI_DIMENSIONS = new Set([512, 640, 768, 896, 1024, 1152, 1280, 1344, 1536, 2048]);

function detectGenerator(text: string): string | null {
  for (const { re, generator } of GENERATOR_PATTERNS) {
    if (re.test(text)) return generator;
  }
  return null;
}

/* --------------------------------- PNG ---------------------------------- */

function parsePng(bytes: Uint8Array): ImageForensics {
  const result: ImageForensics = { format: "png", signals: [], notes: [], definitiveAi: null };
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (bytes.length < 8 || view.getUint32(0) !== 0x89504e47) return result;

  let offset = 8;
  const textEntries: Array<{ keyword: string; value: string }> = [];

  while (offset + 8 <= bytes.length) {
    const length = view.getUint32(offset);
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    const data = bytes.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;
    if (offset > bytes.length) break;

    if (type === "IHDR" && data.length >= 8) {
      result.width = view.getUint32(data.byteOffset);
      result.height = view.getUint32(data.byteOffset + 4);
    } else if (type === "tEXt") {
      const zero = data.indexOf(0);
      if (zero > 0) {
        textEntries.push({
          keyword: Buffer.from(data.subarray(0, zero)).toString("latin1"),
          value: Buffer.from(data.subarray(zero + 1)).toString("latin1"),
        });
      }
    } else if (type === "iTXt" || type === "zTXt") {
      const zero = data.indexOf(0);
      if (zero <= 0) continue;
      const keyword = Buffer.from(data.subarray(0, zero)).toString("latin1");
      try {
        if (type === "zTXt") {
          const inflated = inflateSync(Buffer.from(data.subarray(zero + 2)));
          textEntries.push({ keyword, value: inflated.toString("utf8") });
        } else {
          // iTXt: compressionFlag(1) compressionMethod(1) languageTag\0 translated\0 text
          let cursor = zero + 2;
          const languageEnd = data.indexOf(0, cursor);
          if (languageEnd === -1) continue;
          cursor = languageEnd + 1;
          const translatedEnd = data.indexOf(0, cursor);
          if (translatedEnd === -1) continue;
          const raw = data.subarray(translatedEnd + 1);
          const compressed = data[zero + 1] === 1;
          const value = compressed
            ? inflateSync(Buffer.from(raw)).toString("utf8")
            : Buffer.from(raw).toString("utf8");
          textEntries.push({ keyword, value });
        }
      } catch {
        /* malformed compressed chunk — ignore */
      }
    } else if (type === "IEND") {
      break;
    }
  }

  let matchedGenerator = false;
  for (const { keyword, value } of textEntries) {
    const combined = `${keyword}: ${value}`;
    const fromKey = GENERATOR_CHUNK_KEYS.test(keyword);
    const named = detectGenerator(combined);
    const looksLikePrompt = /(steps?:|cfg scale|sampler|negative prompt|seed:|denoising|--v \d|--ar \d|--style|--sref|--cref|--niji)/i.test(value);

    if (!matchedGenerator && (named || ((fromKey || looksLikePrompt) && value.length > 12))) {
      matchedGenerator = true;
      const generator =
        named ??
        (/(steps?:|cfg scale|negative prompt)/i.test(value)
          ? "Stable Diffusion (parameters metadata)"
          : /--v \d|--ar \d|--niji/i.test(value)
            ? "Midjourney (prompt metadata)"
            : /"nodes"|ksampler|"class_type"/i.test(value)
              ? "ComfyUI (workflow metadata)"
              : "an AI image generator");
      const evidence = value.length > 160 ? `${value.slice(0, 160)}…` : value;
      result.definitiveAi = { generator, evidence: `PNG "${keyword}" chunk contains: ${evidence}` };
      result.signals.push({
        name: "Generator metadata found in file",
        detail: result.definitiveAi.evidence,
        severity: "high",
        pointsTo: "ai",
      });
    } else if (named) {
      matchedGenerator = true;
      result.signals.push({
        name: `Generator signature ("${keyword}")`,
        detail: `PNG text chunk mentions ${named}.`,
        severity: "high",
        pointsTo: "ai",
      });
      if (!result.definitiveAi) {
        result.definitiveAi = { generator: named, evidence: `PNG "${keyword}" chunk mentions ${named}` };
      }
    }
  }

  if (result.width && result.height) {
    const { width, height } = result;
    if (!matchedGenerator && COMMON_AI_DIMENSIONS.has(width) && COMMON_AI_DIMENSIONS.has(height)) {
      result.notes.push(`PNG with no generator metadata; resolution ${width}×${height} is a common generator output size (weak signal only).`);
    } else {
      result.notes.push(`PNG with no generator text metadata (most re-saved PNGs look like this — neutral).`);
    }
  }

  return result;
}

/* --------------------------------- JPEG ---------------------------------- */

function jpegDimensions(bytes: Uint8Array): { width?: number; height?: number } {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    // SOF0..SOF15 (skipping DHT C4, DAC CC, RSTn, SOI/EOI)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: view.getUint16(offset + 5), width: view.getUint16(offset + 7) };
    }
    const length = view.getUint16(offset + 2);
    offset += 2 + length;
  }
  return {};
}

async function parseJpeg(bytes: Uint8Array): Promise<ImageForensics> {
  const dims = jpegDimensions(bytes);
  const result: ImageForensics = { format: "jpeg", width: dims.width, height: dims.height, signals: [], notes: [], definitiveAi: null };

  let tags: Record<string, unknown> = {};
  try {
    tags = (await exifr.parse(Buffer.from(bytes), { tiff: true, exif: true, translateValues: false })) ?? {};
  } catch {
    /* unreadable EXIF — treat as absent */
  }

  const make = typeof tags.Make === "string" ? tags.Make.trim() : "";
  const model = typeof tags.Model === "string" ? tags.Model.trim() : "";
  const software = typeof tags.Software === "string" ? tags.Software.trim() : "";

  const softwareGenerator = detectGenerator(software);
  if (softwareGenerator) {
    result.definitiveAi = { generator: softwareGenerator, evidence: `EXIF Software tag: "${software}"` };
    result.signals.push({
      name: "Generator signature in EXIF",
      detail: `The file's EXIF Software tag reads "${software}".`,
      severity: "high",
      pointsTo: "ai",
    });
  } else if (make || model) {
    result.signals.push({
      name: "Camera EXIF present",
      detail: `EXIF identifies the capturing device: ${[make, model].filter(Boolean).join(" ")}. Generators don't produce camera data.`,
      severity: "high",
      pointsTo: "human",
    });
    result.notes.push(`EXIF shows a real capturing device (${[make, model].filter(Boolean).join(" ")}) — strong evidence of a camera original unless visual evidence contradicts it.`);
  }

  if (tags.DateTimeOriginal || tags.GPSLatitude) {
    result.notes.push("EXIF contains capture time and/or GPS coordinates — typical of camera originals (mild human evidence).");
  }
  if (!Object.keys(tags).length) {
    result.notes.push("No EXIF metadata found. Neutral: cameras write EXIF, but social platforms strip it on re-upload.");
  }

  return result;
}

/* --------------------------------- WebP ---------------------------------- */

async function parseWebp(bytes: Uint8Array): Promise<ImageForensics> {
  const result: ImageForensics = { format: "webp", signals: [], notes: [], definitiveAi: null };
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  // RIFF....WEBP then a chunk; VP8X carries the canvas size
  if (bytes.length > 30 && bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38 && bytes[15] === 0x58) {
    result.width = (view.getUint32(24, true) & 0xffffff) + 1;
    result.height = (view.getUint32(27, true) & 0xffffff) + 1;
  }

  let tags: Record<string, unknown> = {};
  try {
    tags = (await exifr.parse(Buffer.from(bytes))) ?? {};
  } catch {
    /* no EXIF */
  }
  const make = typeof tags.Make === "string" ? tags.Make.trim() : "";
  const model = typeof tags.Model === "string" ? tags.Model.trim() : "";
  if (make || model) {
    result.signals.push({
      name: "Camera EXIF present",
      detail: `EXIF identifies the capturing device: ${[make, model].filter(Boolean).join(" ")}.`,
      severity: "high",
      pointsTo: "human",
    });
    result.notes.push(`EXIF shows a real capturing device (${[make, model].filter(Boolean).join(" ")}) — strong evidence of a camera original unless visual evidence contradicts it.`);
  } else {
    result.notes.push("WebP with no camera EXIF found (neutral — WebP re-encoding strips most metadata).");
  }

  return result;
}

/* -------------------------------- entry ---------------------------------- */

export async function analyzeImageFile(bytes: Uint8Array, mime: string): Promise<ImageForensics> {
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50) return parsePng(bytes);
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8) return parseJpeg(bytes);
  if (
    bytes.length > 12 &&
    bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  ) {
    return parseWebp(bytes);
  }
  return { format: mime.includes("png") ? "png" : "unknown", signals: [], notes: [], definitiveAi: null };
}
