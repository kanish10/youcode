import { createGroq } from "@ai-sdk/groq";
import type { LanguageModel } from "ai";

const MODEL_ID = "llama-3.3-70b-versatile";

/**
 * Returns the chat model for Bloom.
 *
 * Resolution order:
 *   1. If GROQ_API_KEY is set (local .env.local or manually added to Vercel),
 *      use the direct Groq provider.
 *   2. Otherwise fall back to the Vercel AI Gateway via the "groq/..." model
 *      string. On Vercel this is ZERO-CONFIG — an OIDC token is injected
 *      automatically for linked projects, auto-rotated by the platform.
 *      For local dev through the gateway, run `vercel env pull` to fetch
 *      OIDC credentials.
 *
 * Recommended flow: deploy to Vercel without setting any Groq env var and
 * rely on gateway + OIDC (auto-managed, no rotation needed).
 */
export function getBloomModel(): LanguageModel | string {
  if (process.env.GROQ_API_KEY) {
    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });
    return groq(MODEL_ID);
  }
  return `groq/${MODEL_ID}`;
}

/**
 * True if at least one provider path is configured.
 * Preferred: VERCEL_OIDC_TOKEN (auto-injected on Vercel deployments).
 * Manual: GROQ_API_KEY (direct provider).
 */
export function hasBloomModel(): boolean {
  return (
    !!process.env.GROQ_API_KEY ||
    !!process.env.VERCEL_OIDC_TOKEN ||
    !!process.env.VERCEL
  );
}
