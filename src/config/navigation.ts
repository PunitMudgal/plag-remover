/**
 * Central navigation configuration for the application.
 *
 * Single source of truth for the site's top-level links and the tools shown in
 * the "Tools" mega menu. Keeping this here (instead of inside a component)
 * makes it easy to reuse, test, and extend without coupling it to the navbar
 * UI.
 */

import {
  AiEraserIcon,
  AiScanIcon,
  AiUserIcon,
  QuillWrite01Icon,
} from "@hugeicons/core-free-icons";

/** Top-level navigation links rendered next to the Tools menu. */
export const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];

/** Tools shown inside the "Tools" mega menu. */
export const TOOLS = [
  {
    label: "Plagiarism Remover",
    href: "/plagiarism-remover",
    description: "Rewrite flagged content into fresh, fully original text.",
    icon: AiEraserIcon,
    iconClass: "bg-emerald-50 text-emerald-600",
    cardClass: "hover:border-emerald-100 hover:bg-emerald-50/60",
  },
  {
    label: "Plagiarism Checker",
    href: "/plagiarism-checker",
    description: "Scan your text against billions of sources in seconds.",
    icon: AiScanIcon,
    iconClass: "bg-rose-50 text-rose-600",
    cardClass: "hover:border-rose-100 hover:bg-rose-50/60",
  },
  {
    label: "AI to Human Converter",
    href: "/ai-to-human-text-converter",
    description: "Turn robotic AI writing into natural, human-sounding text.",
    icon: AiUserIcon,
    iconClass: "bg-violet-50 text-violet-600",
    cardClass: "hover:border-violet-100 hover:bg-violet-50/60",
  },
  {
    label: "Text Paraphraser",
    href: "/text-paraphraser",
    description: "Rephrase sentences while keeping the exact meaning intact.",
    icon: QuillWrite01Icon,
    iconClass: "bg-amber-50 text-amber-600",
    cardClass: "hover:border-amber-100 hover:bg-amber-50/60",
  },
] as const;

export type Tool = (typeof TOOLS)[number];
