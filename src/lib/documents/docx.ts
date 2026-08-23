import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import { insertInvisibleMarkers } from "@/lib/invisible";

/**
 * Rewrites a .docx in place: unzips the OOXML package, appends the invisible
 * marker to every word inside <w:t> text nodes of word/document.xml, and
 * rezips with every other entry byte-identical — so formatting, styles,
 * images and layout come back exactly as they were.
 *
 * The marker is inserted into the existing (XML-escaped) node content.
 * XML entities never contain whitespace, so word splitting on whitespace is
 * identical on escaped or unescaped text, and U+200C itself needs no
 * escaping.
 */
export function transformDocx(input: Uint8Array): Uint8Array {
  const zip = unzipSync(input);
  const docKey = Object.keys(zip).find((key) => key === "word/document.xml");
  if (!docKey) {
    throw new Error("Invalid .docx file: word/document.xml is missing.");
  }

  const xml = strFromU8(zip[docKey]).replace(
    /<w:t(\s[^>]*)?>([\s\S]*?)<\/w:t>/g,
    (match, attrs: string | undefined, text: string) =>
      text ? `<w:t${attrs ?? ""}>${insertInvisibleMarkers(text)}</w:t>` : match,
  );

  return zipSync({ ...zip, [docKey]: strToU8(xml) });
}
