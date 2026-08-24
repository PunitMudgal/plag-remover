import type { Metadata } from "next";
import { PlagiarismCheckerClient } from "@/components/tools/plagiarism-checker-client";

export const metadata: Metadata = {
  title: "Plagiarism Checker",
  description:
    "Scan your text against live web sources in seconds. See your similarity score, matched sources, and exactly which wording overlaps.",
  keywords: ["plagiarism checker", "check plagiarism online", "plagiarism scanner", "similarity checker"],
  alternates: { canonical: "/plagiarism-checker" },
};

export default function PlagiarismCheckerPage() {
  return <PlagiarismCheckerClient />;
}
