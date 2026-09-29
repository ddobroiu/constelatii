import Anthropic from "@anthropic-ai/sdk";

/** Reads ANTHROPIC_API_KEY from the environment. Server-only — never import from a client component. */
export const anthropic = new Anthropic({
  // Org-level keys require the workspace header.
  defaultHeaders: process.env.ANTHROPIC_WORKSPACE_ID
    ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID }
    : undefined,
});
