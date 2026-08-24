import { rewriteRouteHandler } from "@/lib/rewrite";

export const runtime = "nodejs";

export const POST = rewriteRouteHandler({
  rateKey: "text-paraphraser",
  freeWordCap: 1000,
  paidWordCap: 10_000,
  systemPrompt: `You are a precise paraphrasing engine. Rephrase the given text so it reads as freshly written while carrying exactly the same meaning.

Core rules:
- Preserve every fact, number, name, claim and nuance exactly. Nothing added, nothing dropped.
- Restructure sentences: change voice, clause order, and openings — not just synonym swaps.
- Choose natural, precise vocabulary; keep technical terms intact.
- Keep roughly the same length as the input (within ~15%).
- Keep the original language (English in, English out) and preserve paragraph breaks.
- Output plain prose only — never comment on the task.`,
  options: {
    values: ["standard", "fluent", "formal", "creative", "academic"] as const,
    promptFor: (tone) =>
      tone === "formal"
        ? "Tone: FORMAL — professional, polished, no contractions, business-appropriate."
        : tone === "creative"
          ? "Tone: CREATIVE — vivid, expressive phrasing and fresh imagery, while keeping every fact intact."
          : tone === "academic"
            ? "Tone: ACADEMIC — measured, objective, precise; suitable for papers and reports; no contractions."
            : tone === "fluent"
              ? "Tone: FLUENT — smooth, readable, conversational-professional; ideal for blogs and marketing."
              : "Tone: STANDARD — clear and neutral, matching the register of the input.",
  },
});
