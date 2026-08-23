import type { Metadata } from "next";
import { AiTextDetectorClient } from "@/components/tools/ai-text-detector-client";

export const metadata: Metadata = {
  title: "AI Text Detector — Fuck Plagiarism",
  description:
    "Check what percentage of any text was written by AI. Sentence-by-sentence probabilities plus the writing-style signals behind the verdict.",
};

export default function AiTextDetectorPage() {
  return <AiTextDetectorClient />;
}
