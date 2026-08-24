import type { Metadata } from "next";
import { PlagiarismRemoverClient } from "@/components/tools/plagiarism-remover-client";

export const metadata: Metadata = {
  title: "Plagiarism Remover",
  description:
    "Make your text invisible to plagiarism and AI detectors. Runs entirely in your browser — nothing is uploaded or stored. Free up to 700 words without an account.",
  keywords: ["plagiarism remover", "remove plagiarism", "plagiarism remover tool", "undetectable text"],
  alternates: { canonical: "/plagiarism-remover" },
};

export default function PlagiarismRemoverPage() {
  return <PlagiarismRemoverClient />;
}
