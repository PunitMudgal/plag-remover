import { generateText, Output, isStepCount } from "ai";
import { google as googleDocs } from "@ai-sdk/google";
import { z } from "zod";
import { geminiModel } from "@/lib/gemini";

/** Shared Gemini plagiarism scan used by the pasted-text and document routes. */
export const scanSchema = z.object({
  similarityScore: z.number().min(0).max(100).describe("Estimated % of the text that matches or closely paraphrases existing sources"),
  originalityScore: z.number().min(0).max(100),
  verdict: z.enum(["original", "minor-matches", "significant-matches", "plagiarized"]),
  summary: z.string().describe("One or two sentences describing what was found"),
  matches: z
    .array(
      z.object({
        url: z.string().describe("Canonical URL of the matching source page"),
        title: z.string().describe("Title of the matching source page"),
        domain: z.string().describe("Domain name only, e.g. wikipedia.org"),
        similarity: z.number().min(0).max(100).describe("How much of this source's relevant content overlaps the input"),
        matchedSegments: z
          .array(z.string())
          .describe("Exact phrases from the input that also appear in this source"),
      }),
    )
    .describe("Verified sources only — every match must have been found via search and truly overlap"),
});

export type PlagiarismScan = z.infer<typeof scanSchema>;

const SCAN_PROMPT = `You are a plagiarism detection engine with live Google Search access via the google_search tool. Scan the user's text for content that already exists online.

Procedure — follow it strictly:
1. Extract 5 to 8 distinctive phrases from the text (4-8 consecutive words that are unusual together; skip stop-word-only phrases).
2. Search the web for each phrase using google_search.
3. For every search result that looks relevant, compare the result's content against the input text. Only report a match when wording genuinely overlaps verbatim or as a close paraphrase. Never report a source you did not actually see in search results, and never invent URLs.
4. Estimate similarityScore as the share of the input's content covered by verified matches.

If searches find nothing that overlaps, that is a valid result: return similarityScore 0, verdict "original", and an empty matches array.

Text to scan (delimited by <text></text>):
<text>
`;

export async function runPlagiarismScan(text: string): Promise<PlagiarismScan> {
  const { output } = await generateText({
    model: geminiModel(),
    tools: {
      google_search: googleDocs.tools.googleSearch({}),
    },
    output: Output.object({ schema: scanSchema }),
    temperature: 0,
    maxOutputTokens: 8192,
    stopWhen: isStepCount(10),
    prompt: `${SCAN_PROMPT}${text}
</text>`,
  });
  return output;
}
