import type { Metadata } from "next";
import { PlagiarismCheckerClient } from "@/components/tools/plagiarism-checker-client";

export const metadata: Metadata = {
  title: "Plagiarism Checker — Fuck Plagiarism",
  description:
    "Scan your text against live web sources in seconds. See your similarity score, matched sources, and exactly which wording overlaps.",
};

export default function PlagiarismCheckerPage() {
  return <PlagiarismCheckerClient />;
}
