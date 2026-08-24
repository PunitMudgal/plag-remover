/**
 * Canonical site facts used by metadata, sitemap, robots and JSON-LD.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://plag-remover.com);
 * falls back to the local dev server.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = "Fuck Plagiarism";

export const SITE_DESCRIPTION =
  "Remove plagiarism from text and documents, detect AI-written text and AI-generated images, and scan your work against live web sources. Free to start, Pro from $3/month.";
