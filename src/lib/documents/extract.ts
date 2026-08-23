import mammoth from "mammoth";
import WordExtractor from "word-extractor";
import { extractText, getDocumentProxy } from "unpdf";
import { type DocExtension } from "@/lib/documents/constants";

/** Thrown with a user-friendly message when a document can't be processed. */
export class DocumentError extends Error {}

/** Extracts plain text from a supported document buffer. */
export async function extractDocumentText(buffer: Buffer, ext: DocExtension): Promise<string> {
  switch (ext) {
    case "txt": {
      let text = buffer.toString("utf8");
      if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // strip BOM
      return text;
    }
    case "docx": {
      const { value } = await mammoth.extractRawText({ buffer });
      return value;
    }
    case "pdf": {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      const { text } = await extractText(pdf, { mergePages: true });
      if (!text.trim()) {
        throw new DocumentError(
          "This PDF has no selectable text — it looks like a scan. Please upload a text-based PDF.",
        );
      }
      return text;
    }
    case "doc": {
      const extractor = new WordExtractor();
      const document = await extractor.extract(buffer);
      return document.getBody();
    }
  }
}
