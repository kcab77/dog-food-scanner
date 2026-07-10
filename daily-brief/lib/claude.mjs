// Thin Anthropic client wrapper. Returns the concatenated text of all text
// blocks in the response. Pass `tools` (e.g. the web_search server tool) to
// enable server-side tool use — Anthropic runs the tool within the same call.
import Anthropic from "@anthropic-ai/sdk";

export async function ask({ system, user, model, tools, maxTokens = 2000 }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY not set in daily-brief/.env");
  }
  // Created lazily (not at module load) so .env is loaded first under ESM import hoisting.
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const params = {
    model,
    max_tokens: maxTokens,
    messages: [{ role: "user", content: user }],
  };
  if (system) params.system = system;
  if (tools) params.tools = tools;

  const resp = await client.messages.create(params);
  return (resp.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
}
