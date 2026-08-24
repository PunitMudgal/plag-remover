import type { Metadata } from "next";
import { AiTextDetectorClient } from "@/components/tools/ai-text-detector-client";

export const metadata: Metadata = {
  title: "AI Text Detector",
  description:
    "Check what percentage of any text was written by AI. Sentence-by-sentence probabilities plus the writing-style signals behind the verdict.",
  keywords: ["AI text detector", "AI content detector", "detect ChatGPT writing", "AI writing checker"],
  alternates: { canonical: "/ai-text-detector" },
};

export default function AiTextDetectorPage() {
  return <AiTextDetectorClient />;
}
