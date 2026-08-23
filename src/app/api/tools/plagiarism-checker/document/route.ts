import { NoOutputGeneratedError } from "ai";
import { badRequest, geminiNotConfigured, requirePaidPlan, tooManyRequests } from "@/lib/tool-route";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { docValidationError, extensionOf, isDocExtension } from "@/lib/documents/constants";
import { DocumentError, extractDocumentText } from "@/lib/documents/extract";
import { runPlagiarismScan } from "@/lib/scan";

export const runtime = "nodejs";

const MAX_CHARS = 50_000;

/** Pro-only document mode for the plagiarism checker: extract text, then run
 *  the same Gemini scan as the pasted-text route. */
export async function POST(request: Request) {
  const authError = await requirePaidPlan();
  if (authError) return authError;

  if (!rateLimit(`checker-document:${clientIp(request)}`, 6, 60_000)) {
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

  const file = form.get("document");
  if (!(file instanceof File)) {
    return badRequest("Please attach a document to scan.");
  }

  const ext = extensionOf(file.name);
  const validationError = docValidationError(file.name, file.size);
  if (validationError || !isDocExtension(ext)) {
    return badRequest(validationError ?? "Unsupported file type.");
  }

  let text: string;
  try {
    text = (await extractDocumentText(Buffer.from(await file.arrayBuffer()), ext)).trim();
  } catch (error) {
    if (error instanceof DocumentError) {
      return badRequest(error.message);
    }
    console.error("[plagiarism-checker/document:extract]", error);
    return Response.json(
      { error: "Could not read this document. Make sure the file is not corrupted or password-protected." },
      { status: 500 },
    );
  }

  if (text.split(/\s+/).length < 20) {
    return badRequest("The document has fewer than 20 words of text — too little to scan.");
  }
  if (text.length > MAX_CHARS) {
    return badRequest(`The document has ${text.length.toLocaleString()} characters; the limit for document scans is ${MAX_CHARS.toLocaleString()}.`);
  }

  try {
    const scan = await runPlagiarismScan(text);
    return Response.json({ ...scan, extractedText: text });
  } catch (error) {
    if (NoOutputGeneratedError.isInstance(error)) {
      return Response.json(
        { error: "The scan came back incomplete. Please try again." },
        { status: 502 },
      );
    }
    console.error("[plagiarism-checker/document]", error);
    return Response.json(
      { error: "Something went wrong while scanning your document. Please try again." },
      { status: 500 },
    );
  }
}
