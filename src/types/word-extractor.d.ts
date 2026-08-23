declare module "word-extractor" {
  interface ExtractedDocument {
    getBody(): string;
    getFootnotes(): string;
    getEndnotes(): string;
    getHeaders(): string;
    getFooters(): string;
    getAnnotations(): string;
    getTextboxContent(): string;
  }

  export default class WordExtractor {
    extract(source: string | Buffer | Uint8Array): Promise<ExtractedDocument>;
  }
}
