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
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

function StructuredData() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      offers: [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "3", priceCurrency: "USD" },
        { "@type": "Offer", name: "Creator", price: "5", priceCurrency: "USD" },
      ],
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <StructuredData />
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
