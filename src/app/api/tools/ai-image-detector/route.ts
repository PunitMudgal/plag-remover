import { generateText, Output, isStepCount, NoOutputGeneratedError } from "ai";
import { z } from "zod";
import { geminiModel } from "@/lib/gemini";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { badRequest, geminiNotConfigured, requireSignedIn, tooManyRequests } from "@/lib/tool-route";

export const runtime = "nodejs";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

const analysisSchema = z.object({
  aiProbability: z.number().min(0).max(100).describe("Estimated probability the image was AI-generated"),
  verdict: z.enum(["ai-generated", "likely-ai", "uncertain", "likely-human", "human"]),
  confidence: z.enum(["low", "medium", "high"]),
  summary: z.string().describe("One or two sentences explaining the overall conclusion"),
  possibleGenerator: z
    .string()
    .nullable()
    .describe("If the style is recognizable, the likely generator (e.g. 'Midjourney-style diffusion model'), otherwise null"),
  signals: z
    .array(
      z.object({
        name: z.string().describe("Short signal name, e.g. 'Inconsistent hands'"),
        detail: z.string().describe("One sentence pointing at the concrete evidence in this image"),
        severity: z.enum(["low", "medium", "high"]),
        pointsTo: z.enum(["ai", "human"]).describe("Whether this signal suggests AI generation or a human capture"),
      }),
    )
    .describe("3-6 visual and structural signals observed in the image"),
});

export async function POST(request: Request) {
  const authError = await requireSignedIn();
  if (authError) return authError;

  if (!rateLimit(`ai-image-detector:${clientIp(request)}`, 10, 60_000)) {
    return tooManyRequests();
  }

  const configError = geminiNotConfigured();
  if (configError) return configError;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Invalid request body.");
  }

  const file = form.get("image");
  if (!(file instanceof File)) {
    return badRequest("Please attach an image to analyze.");
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return badRequest("Only PNG, JPG and WebP images are supported.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    return badRequest("Image must be smaller than 8 MB.");
  }

  try {
    const imageBytes = new Uint8Array(await file.arrayBuffer());

    const { output } = await generateText({
      model: geminiModel(),
      output: Output.object({ schema: analysisSchema }),
      temperature: 0,
      maxOutputTokens: 8192,
      stopWhen: isStepCount(2),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a forensic image analyst specializing in detecting AI-generated images (diffusion models like Midjourney, Stable Diffusion, DALL·E, Flux, Imagen, and GANs).

Examine the attached image for AI-generation signals:
- Anatomy: hands, fingers, teeth, eyes, ears, limbs — count and shape errors.
- Text in the image: gibberish, distorted or impossible letterforms.
- Physics: inconsistent lighting, shadows, reflections, perspective, gravity.
- Materials: impossibly smooth skin/fabric, waxy textures, melted details, background swirls.
- Composition: dreamlike background blurs, asymmetric jewelry/glasses, objects blending into each other.
- Structure: overall noise pattern uniformity vs. sensor noise, over-sharpened "AI sparkle" look.

Signals that point to a human capture include natural sensor noise, motion blur, exposure imperfections, credible depth of field, and physically coherent details — list those with pointsTo "human" when present.

Be calibrated and honest: this is a heuristic. Use "uncertain" verdict and "low" confidence when evidence is weak. Set possibleGenerator only when the style is genuinely recognizable; otherwise null.`,
            },
            { type: "file", mediaType: "image", data: imageBytes },
          ],
        },
      ],
    });

    return Response.json(output);
  } catch (error) {
    if (NoOutputGeneratedError.isInstance(error)) {
      return Response.json(
        { error: "The analysis came back incomplete. Please try again." },
        { status: 502 },
      );
    }
    console.error("[ai-image-detector]", error);
    return Response.json(
      { error: "Something went wrong while analyzing your image. Please try again." },
      { status: 500 },
    );
  }
}
