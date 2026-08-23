import { createGoogle, type GoogleProvider } from "@ai-sdk/google";

/** Current fast Gemini model used by all detection tools. */
export const GEMINI_MODEL_ID = "gemini-3.7-flash";

export function isGeminiConfigured(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

let cached: GoogleProvider | undefined;

/**
 * Shared Gemini provider for the detection tools. Check isGeminiConfigured()
 * before calling so routes can return a friendly error instead of leaking a
 * provider auth failure to the client.
 */
export function gemini(): GoogleProvider {
  cached ??= createGoogle({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY });
  return cached;
}

export function geminiModel() {
  return gemini()(GEMINI_MODEL_ID);
}
