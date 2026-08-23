import { badRequest, requirePaidPlan, tooManyRequests } from "@/lib/tool-route";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  baseName,
  DOC_MIME_BY_EXT,
  docValidationError,
  extensionOf,
  isDocExtension,
  safeFilename,
} from "@/lib/documents/constants";
import { DocumentError, extractDocumentText } from "@/lib/documents/extract";
import { transformDocx } from "@/lib/documents/docx";
import { insertInvisibleMarkers } from "@/lib/invisible";

export const runtime = "nodejs";

/**
 * Pro-only document mode for the plagiarism remover.
 * .txt and .docx are returned format-preserved with the invisible markers
 * embedded; .pdf and .doc are extracted and returned as transformed .txt
 * (those formats cannot be safely rewritten in place).
 */
export async function POST(request: Request) {
  const authError = await requirePaidPlan();
  if (authError) return authError;

  if (!rateLimit(`remover-document:${clientIp(request)}`, 6, 60_000)) {
    return tooManyRequests();
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest("Invalid request body.");
  }

  const file = form.get("document");
  if (!(file instanceof File)) {
    return badRequest("Please attach a document to transform.");
  }

  const ext = extensionOf(file.name);
  const validationError = docValidationError(file.name, file.size);
  if (validationError || !isDocExtension(ext)) {
    return badRequest(validationError ?? "Unsupported file type.");
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    if (ext === "docx") {
      const bytes = transformDocx(new Uint8Array(buffer));
      return fileResponse(bytes, DOC_MIME_BY_EXT.docx, safeFilename(file.name));
    }

    let text: string;
    if (ext === "txt") {
      text = buffer.toString("utf8").replace(/^\uFEFF/, "");
    } else {
      // pdf and doc: extract text, deliver as .txt
      text = (await extractDocumentText(buffer, ext)).trim();
    }

    const output = insertInvisibleMarkers(text);
    const filename = ext === "txt" ? safeFilename(file.name) : `${safeFilename(baseName(file.name))}.txt`;
    return fileResponse(new TextEncoder().encode(output), DOC_MIME_BY_EXT.txt, filename);
  } catch (error) {
    if (error instanceof DocumentError) {
      return badRequest(error.message);
    }
    console.error("[plagiarism-remover/document]", error);
    return Response.json(
      { error: "Something went wrong while transforming your document. Please try again." },
      { status: 500 },
    );
  }
}

function fileResponse(bytes: Uint8Array, mime: string, filename: string): Response {
  return new Response(bytes as BodyInit, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
