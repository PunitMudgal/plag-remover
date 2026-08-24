import type { Metadata } from "next";
import { AiImageDetectorClient } from "@/components/tools/ai-image-detector-client";

export const metadata: Metadata = {
  title: "AI Image Detector",
  description:
    "Upload an image and instantly see the probability it was AI-generated, with visual forensic signals like anatomy, text artifacts, and lighting.",
  keywords: ["AI image detector", "detect AI images", "Midjourney detector", "AI photo checker"],
  alternates: { canonical: "/ai-image-detector" },
};

export default function AiImageDetectorPage() {
  return <AiImageDetectorClient />;
}
