import type { Metadata } from "next";
import { RewriteTool } from "@/components/tools/rewrite-tool";

export const metadata: Metadata = {
  title: "Text Paraphraser",
  description:
    "Rephrase sentences while keeping the exact meaning intact. Five tones — standard, fluent, formal, creative, academic — with results streaming live.",
  keywords: [
    "paraphrasing tool",
    "text paraphraser",
    "rephrase sentences",
    "sentence rewriter",
    "paraphrase online",
  ],
  alternates: { canonical: "/text-paraphraser" },
};

export default function TextParaphraserPage() {
  return (
    <RewriteTool
      eyebrow="Text paraphraser"
      title={
        <>
          Same meaning. <span className="text-amber-600">Fresh words.</span>
        </>
      }
      description="Rephrase any paragraph or essay with every fact preserved — pick a tone and watch the rewrite stream in live."
      footer="Free up to 1,000 words with an account · Pro up to 10,000 · Nothing is stored"
      accent="amber"
      apiPath="/api/tools/text-paraphraser"
      inputLabel="Text to paraphrase"
      placeholder="Paste the text you want to rephrase..."
      freeWordCap={1000}
      paidWordCap={10000}
      submitLabel="Paraphrase text"
      busyLabel="Paraphrasing…"
      loadingTitle="Paraphrasing your text"
      loadingMessages={[
        "Understanding meaning and tone",
        "Restructuring sentences",
        "Choosing fresh wording",
      ]}
      optionsLabel="Tone"
      options={[
        { value: "standard", label: "Standard" },
        { value: "fluent", label: "Fluent" },
        { value: "formal", label: "Formal" },
        { value: "creative", label: "Creative" },
        { value: "academic", label: "Academic" },
      ]}
      resultLabel="Paraphrased text"
      idleHint="Paste text above, choose a tone, and your paraphrase will appear here — streamed live as it's written."
    />
  );
}
