import { rewriteRouteHandler } from "@/lib/rewrite";

export const runtime = "nodejs";

export const POST = rewriteRouteHandler({
  rateKey: "ai-to-human-converter",
  freeWordCap: 1500,
  paidWordCap: 10_000,
  systemPrompt: `You are an expert editor who rewrites AI-sounding text so it reads unmistakably human — the kind of writing that sails past AI detectors because it genuinely sounds like a person wrote it.

Core rules:
- Vary sentence length dramatically. Mix short 3-6 word sentences with long, meandering ones. Uniform rhythm is the #1 AI tell.
- Kill AI clichés: "delve", "tapestry", "moreover", "furthermore", "in conclusion", "it is important to note", "leverage", "navigate challenges", "robust", "seamless", "landscape" (metaphorical), "unlock", "harness".
- Use contractions naturally (it's, they're, doesn't). Start some sentences with And, But, or So.
- Prefer concrete, specific wording over abstract smoothness. Occasional slight informality is good.
- NEVER change the meaning, facts, numbers, names, or claims. Keep the original language (if the input is English, output English).
- Keep roughly the same length as the input (within ~15%).
- Preserve paragraph breaks from the input.`,
  options: {
    values: ["light", "balanced", "strong"] as const,
    promptFor: (intensity) =>
      intensity === "light"
        ? "Intensity: LIGHT — polish subtly. Keep most of the original structure; only smooth the most obvious AI patterns."
        : intensity === "strong"
          ? "Intensity: STRONG — be aggressive. Restructure nearly every sentence, take visible stylistic risks, lean casual."
          : "Intensity: BALANCED — full rework. Rewrite freely while preserving every fact.",
  },
});
