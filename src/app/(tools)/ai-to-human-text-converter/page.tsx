import type { Metadata } from "next";
import { RewriteTool } from "@/components/tools/rewrite-tool";

export const metadata: Metadata = {
  title: "AI to Human Text Converter",
  description:
    "Turn robotic AI writing into natural, human-sounding text. Varied rhythm, real vocabulary, zero AI clichés — rewritten live as you watch.",
  keywords: [
    "AI to human text converter",
    "humanize AI text",
    "AI humanizer",
    "make AI text undetectable",
    "bypass AI detection",
  ],
  alternates: { canonical: "/ai-to-human-text-converter" },
};

export default function AiToHumanConverterPage() {
  return (
    <RewriteTool
      eyebrow="AI to human converter"
      title={
        <>
          Robotic in. <span className="text-violet-600">Human out.</span>
        </>
      }
      description="Paste AI-generated text and watch it come back sounding like you wrote it at 2am — varied rhythm, real words, zero 'delve into the tapestry'."
      footer="Free up to 1,500 words with an account · Pro up to 10,000 · Nothing is stored"
      accent="violet"
      apiPath="/api/tools/ai-to-human-converter"
      inputLabel="AI text to humanize"
      placeholder="Paste the AI-generated text you want to sound human..."
      freeWordCap={1500}
      paidWordCap={10000}
      submitLabel="Humanize text"
      busyLabel="Humanizing…"
      loadingTitle="Humanizing your text"
      loadingMessages={[
        "Reading rhythm and vocabulary",
        "Breaking uniform sentence patterns",
        "Rewriting with human variation",
      ]}
      optionsLabel="Rewrite intensity"
      options={[
        { value: "light", label: "Light" },
        { value: "balanced", label: "Balanced" },
        { value: "strong", label: "Strong" },
      ]}
      resultLabel="Humanized text"
      idleHint="Paste AI text above, pick an intensity, and the human version will write itself here — live."
    />
  );
}
