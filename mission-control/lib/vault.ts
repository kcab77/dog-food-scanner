// Fire-and-forget save to the Obsidian vault. Never throws — a vault problem
// must never break a chat.
export function saveToVault(payload: { kind: "chat" | "goal" | "journal"; agent?: string; user?: string; assistant?: string; text?: string }) {
  try {
    void fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
