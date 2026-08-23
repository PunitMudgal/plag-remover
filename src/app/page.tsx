import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import {
  StatsBar,
  ToolsSection,
  HowItWorks,
  BentoSection,
  TestimonialsSection,
  PricingSection,
  FaqSection,
  FinalCta,
  SiteFooter,
} from "@/components/landing/landing-sections";

export const metadata: Metadata = {
  title: "Fuck Plagiarism — Remove Plagiarism, Detect AI Text & Images",
  description:
    "Make plagiarism disappear. Remove plagiarism from text and documents, detect AI-written text and AI-generated images, and scan against live web sources. Free to start, Pro from $3/month.",
};

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-40 size-112 rounded-full bg-violet-200/50 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/3 size-96 rounded-full bg-fuchsia-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-48 -right-24 size-120 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <Hero />
        <StatsBar />
        <ToolsSection />
        <HowItWorks />
        <BentoSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <FinalCta />
      </div>
      <SiteFooter />
    </main>
  );
}
