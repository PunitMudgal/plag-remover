export const DOC_EXTENSIONS = ["txt", "docx", "doc", "pdf"] as const;
export type DocExtension = (typeof DOC_EXTENSIONS)[number];

export const DOC_MAX_BYTES = 10 * 1024 * 1024;

export const DOC_MIME_BY_EXT: Record<DocExtension, string> = {
  txt: "text/plain; charset=utf-8",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  doc: "application/msword",
  pdf: "application/pdf",
};

export function extensionOf(filename: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(filename);
  return match ? match[1].toLowerCase() : "";
}

export function isDocExtension(ext: string): ext is DocExtension {
  return (DOC_EXTENSIONS as readonly string[]).includes(ext);
}

/** Client- and server-side validation of an uploaded document. */
export function docValidationError(name: string, size: number): string | null {
  if (!isDocExtension(extensionOf(name))) {
    return "Only .txt, .docx, .doc and .pdf files are supported.";
  }
  if (size > DOC_MAX_BYTES) {
    return "File must be smaller than 10 MB.";
  }
  return null;
}

/** Sanitizes a filename for the Content-Disposition header. */
export function safeFilename(name: string): string {
  return name.replace(/[^\w.\- ]+/g, "_").trim() || "document";
}

/** Strips the extension from a filename ("report.docx" → "report"). */
export function baseName(name: string): string {
  return name.replace(/\.[a-z0-9]+$/i, "");
}
