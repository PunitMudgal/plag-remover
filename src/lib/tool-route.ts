import { auth } from "@clerk/nextjs/server";
import { hasPaidPlan } from "@/config/billing";
import { isGeminiConfigured } from "@/lib/gemini";

/** Shared guards for the tool API routes. Each returns a Response when the
 *  request must be rejected, or null when the route may continue. */

export async function requireSignedIn(): Promise<Response | null> {
  const { userId } = await auth();
  if (!userId) {
    return Response.json(
      { error: "Please sign in to run this tool." },
      { status: 401 },
    );
  }
  return null;
}

/** For Pro-only features (document uploads): 401 when signed out, 403 on a free plan. */
export async function requirePaidPlan(): Promise<Response | null> {
  const { userId, has } = await auth();
  if (!userId) {
    return Response.json(
      { error: "Please sign in to use document mode." },
      { status: 401 },
    );
  }
  if (!hasPaidPlan(has)) {
    return Response.json(
      { error: "Document mode is a Pro feature. Upgrade to upload PDF, DOCX, DOC and TXT files." },
      { status: 403 },
    );
  }
  return null;
}

export function geminiNotConfigured(): Response | null {
  if (!isGeminiConfigured()) {
    return Response.json(
      { error: "The detection service is not configured yet. Add GOOGLE_GENERATIVE_AI_API_KEY to the server environment." },
      { status: 500 },
    );
  }
  return null;
}

export function tooManyRequests(): Response {
  return Response.json(
    { error: "You're running this tool too quickly. Please wait a moment and try again." },
    { status: 429 },
  );
}

export function badRequest(error: string): Response {
  return Response.json({ error }, { status: 400 });
}
