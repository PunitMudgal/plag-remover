import type { Metadata } from "next";
import { PlagiarismRemoverClient } from "@/components/tools/plagiarism-remover-client";

export const metadata: Metadata = {
  title: "Plagiarism Remover — Fuck Plagiarism",
  description:
    "Make your text invisible to plagiarism and AI detectors. Runs entirely in your browser — nothing is uploaded or stored. Free up to 700 words without an account.",
};

export default function PlagiarismRemoverPage() {
  return <PlagiarismRemoverClient />;
}
