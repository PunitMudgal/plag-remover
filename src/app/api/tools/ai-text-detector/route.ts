import { generateText, Output, isStepCount, NoOutputGeneratedError } from "ai";
import { z } from "zod";
import { geminiModel } from "@/lib/gemini";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { badRequest, geminiNotConfigured, requireSignedIn, tooManyRequests } from "@/lib/tool-route";

export const runtime = "nodejs";

const bodySchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Please paste some text to analyze.")
    .max(10_000, "Text is limited to 10,000 characters."),
});

const analysisSchema = z.object({
  aiPercentage: z.number().min(0).max(100).describe("Estimated share of the text written by AI"),
  humanPercentage: z.number().min(0).max(100),
  verdict: z.enum(["human", "mixed", "likely-ai", "very-likely-ai"]),
  confidence: z.enum(["low", "medium", "high"]).describe("Reliability of this analysis for this input"),
  summary: z.string().describe("One or two sentences explaining the overall conclusion"),
  sentences: z
    .array(
      z.object({
        text: z.string().describe("The exact sentence from the input, verbatim"),
        aiProbability: z.number().min(0).max(100),
      }),
    )
    .describe("Every sentence of the input in order, each with its own AI probability"),
  signals: z
    .array(
      z.object({
        name: z.string().describe("Short signal name, e.g. 'Low burstiness'"),
        detail: z.string().describe("One sentence describing this signal in the input"),
        strength: z.number().min(0).max(100).describe("How strongly this signal suggests AI authorship"),
      }),
    )
    .describe("3-6 writing-style signals that drove the verdict"),
});

export async function POST(request: Request) {
  const authError = await requireSignedIn();
  if (authError) return authError;

  if (!rateLimit(`ai-text-detector:${clientIp(request)}`, 10, 60_000)) {
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
  const wordCount = text.split(/\s+/).length;
  if (wordCount < 20) {
    return badRequest("Please provide at least 20 words — detection is unreliable on shorter text.");
  }

  try {
    const { output } = await generateText({
      model: geminiModel(),
      output: Output.object({ schema: analysisSchema }),
      temperature: 0,
      maxOutputTokens: 8192,
      stopWhen: isStepCount(2),
      prompt: `You are an expert AI-content detection analyst. Estimate how much of the following text was written by generative AI (such as ChatGPT, Gemini, Claude or similar) versus by a human.

Analyze these signals, among others:
- Burstiness: humans vary sentence length a lot; AI is uniform.
- Word choice: predictable, safe vocabulary vs. surprising, specific, personal words.
- Generic scaffolding: "moreover", "in conclusion", "it is important to note", perfectly balanced paragraphs.
- Voice: absence of personal anecdotes, opinions, typos, or idiosyncratic style.
- Structure: flawless parallelism and listy, template-like organization.

Be honest and calibrated. This is a heuristic, not a certainty: keep confidence "low" when the text is under ~150 words or genuinely ambiguous, and never claim certainty. Classify EVERY sentence of the input in order with its own AI probability. Your aiPercentage must reflect the sentences, not a guess.

Text to analyze (delimited by <text></text>):
<text>
${text}
</text>`,
    });

    return Response.json(output);
  } catch (error) {
    if (NoOutputGeneratedError.isInstance(error)) {
      return Response.json(
        { error: "The analysis came back incomplete. Please try again." },
        { status: 502 },
      );
    }
    console.error("[ai-text-detector]", error);
    return Response.json(
      { error: "Something went wrong while analyzing your text. Please try again." },
      { status: 500 },
    );
  }
}
