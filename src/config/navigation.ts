/**
 * Central navigation configuration for the application.
 *
 * Single source of truth for the site's top-level links. Keeping this here
 * (instead of inside a component) makes it easy to reuse, test, and extend
 * without coupling it to the navbar UI.
 */

export const NAV_LINKS = [
  { label: "Tool", href: "/tool" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
] as const;

export type NavLink = (typeof NAV_LINKS)[number];