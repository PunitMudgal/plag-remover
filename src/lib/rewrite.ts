import { auth } from "@clerk/nextjs/server";
import { streamText } from "ai";
import { z } from "zod";
import { geminiModel, isGeminiConfigured } from "@/lib/gemini";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { hasPaidPlan } from "@/config/billing";

/**
 * Factory for the streaming rewrite tools (AI-to-human converter, paraphraser).
 * Auth is required; free plans get a word cap, paid plans a higher one.
 * Returns a plain-text stream the client renders live.
 */
export function rewriteRouteHandler(config: {
  rateKey: string;
  freeWordCap: number;
  paidWordCap: number;
  systemPrompt: string;
  /** Optional client-selectable mode (tone / intensity). */
  options?: {
    values: readonly string[];
    promptFor: (value: string) => string;
  };
}) {
  const bodySchema = z.object({
    text: z
      .string()
      .trim()
      .min(1, "Please paste some text first.")
      .max(30_000, "Text is limited to 30,000 characters."),
    option: z.string().optional(),
  });

  return async function POST(request: Request): Promise<Response> {
    const { userId, has } = await auth();
    if (!userId) {
      return Response.json({ error: "Please sign in to run this tool." }, { status: 401 });
    }

    if (!rateLimit(`${config.rateKey}:${clientIp(request)}`, 8, 60_000)) {
      return Response.json(
        { error: "You're running this tool too quickly. Please wait a moment and try again." },
        { status: 429 },
      );
    }

    if (!isGeminiConfigured()) {
      return Response.json(
        { error: "The rewriting service is not configured yet. Add GOOGLE_GENERATIVE_AI_API_KEY to the server environment." },
        { status: 500 },
      );
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const parsed = bodySchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 },
      );
    }

    const { text, option } = parsed.data;
    if (config.options && (!option || !config.options.values.includes(option))) {
      return Response.json({ error: "Invalid option selected." }, { status: 400 });
    }

    const paid = hasPaidPlan(has);
    const wordCap = paid ? config.paidWordCap : config.freeWordCap;
    const wordCount = text.split(/\s+/).length;
    if (wordCount < 5) {
      return Response.json({ error: "Please provide at least 5 words to rewrite." }, { status: 400 });
    }
    if (wordCount > wordCap) {
      return Response.json(
        {
          error: paid
            ? `Text is limited to ${config.paidWordCap.toLocaleString()} words per run (you pasted ${wordCount.toLocaleString()}).`
            : `The free plan covers up to ${config.freeWordCap.toLocaleString()} words per run — you pasted ${wordCount.toLocaleString()}. Upgrade to Pro for up to ${config.paidWordCap.toLocaleString()}.`,
        },
        { status: 400 },
      );
    }

    const optionDirective = config.options ? config.options.promptFor(option!) : "";
    const prompt = `${config.systemPrompt}

${optionDirective}

Rewrite the text between <text></text> following every rule above. Output ONLY the rewritten text — no preamble, no quotation marks, no markdown.

<text>
${text}
</text>`;

    const result = streamText({
      model: geminiModel(),
      temperature: 0.8,
      prompt,
      onError({ error }) {
        console.error(`[${config.rateKey}]`, error);
      },
    });

    return new Response(result.textStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Accel-Buffering": "no",
      },
    });
  };
}
