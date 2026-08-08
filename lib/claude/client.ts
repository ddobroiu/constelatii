import Anthropic from "@anthropic-ai/sdk";

/** Reads ANTHROPIC_API_KEY from the environment. Server-only — never import from a client component. */
export const anthropic = new Anthropic();
