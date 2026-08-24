import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing — free forever for pasted text, Pro from $3/month for unlimited transformations, document uploads, and priority support.",
  keywords: ["plagiarism remover pricing", "AI detector pricing", "plagiarism tool plans"],
  alternates: { canonical: "/pricing" },
};

export default function PricingLayout({ children }: LayoutProps<"/pricing">) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${SITE_NAME} — plagiarism & AI detection tools`,
    url: `${SITE_URL}/pricing`,
    description:
      "Plagiarism remover, plagiarism checker, AI text detector and AI image detector with free and paid plans.",
    offers: [
      { "@type": "Offer", name: "Free", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Pro", price: "3", priceCurrency: "USD", availability: "https://schema.org/InStock" },
      { "@type": "Offer", name: "Creator", price: "5", priceCurrency: "USD", availability: "https://schema.org/InStock" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
