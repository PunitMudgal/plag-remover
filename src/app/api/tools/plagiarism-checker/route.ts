import { NoOutputGeneratedError } from "ai";
import { z } from "zod";
import { geminiNotConfigured, badRequest, requireSignedIn, tooManyRequests } from "@/lib/tool-route";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { runPlagiarismScan } from "@/lib/scan";

export const runtime = "nodejs";

const bodySchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Please paste some text to scan.")
    .max(10_000, "Text is limited to 10,000 characters."),
});

export async function POST(request: Request) {
  const authError = await requireSignedIn();
  if (authError) return authError;

  if (!rateLimit(`plagiarism-checker:${clientIp(request)}`, 10, 60_000)) {
    return tooManyRequests();
  }

  const configError = geminiNotConfigured();
  if (configError) return configError;

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return badRequest("Invalid request body.");
  }

  const parsed = bodySchema.safeParse(raw);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid input.");
  }

  const text = parsed.data.text;
  if (text.split(/\s+/).length < 20) {
    return badRequest("Please provide at least 20 words to scan.");
  }

  try {
    const scan = await runPlagiarismScan(text);
    return Response.json(scan);
  } catch (error) {
    if (NoOutputGeneratedError.isInstance(error)) {
      return Response.json(
        { error: "The scan came back incomplete. Please try again." },
        { status: 502 },
      );
    }
    console.error("[plagiarism-checker]", error);
    return Response.json(
      { error: "Something went wrong while scanning your text. Please try again." },
      { status: 500 },
    );
  }
}
