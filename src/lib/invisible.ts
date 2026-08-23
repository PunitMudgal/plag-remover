/**
 * The plagiarism-remover trick: two zero-width non-joiner characters after
 * every word. Detectors and plagiarism scanners tokenize words differently
 * once the markers are present, while the rendered text looks unchanged.
 * Shared by the in-browser remover and the server-side document pipeline so
 * both produce identical output.
 */
export const INVISIBLE_MARKER = "\u200C\u200C";

/** Inserts the invisible marker after every word, preserving whitespace. */
export function insertInvisibleMarkers(text: string): string {
  return text
    .split(/(\s+)/)
    .map((part) => (/\s+/.test(part) ? part : part + INVISIBLE_MARKER))
    .join("");
}
