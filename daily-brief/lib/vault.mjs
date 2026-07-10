// Vault helpers. VAULT_PATH contains a space ("Obsidian Vault") — always use
// path.join, never string concatenation.
import { promises as fs } from "fs";
import path from "path";

function resolveInVault(relativePath) {
  const vault = process.env.VAULT_PATH;
  if (!vault) throw new Error("VAULT_PATH not set in daily-brief/.env");
  return path.join(vault, relativePath);
}

// Read a vault note -> string, or null if it doesn't exist.
export async function readNote(relativePath) {
  try {
    return await fs.readFile(resolveInVault(relativePath), "utf-8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

// Write a note, creating parent dirs as needed (UTF-8).
export async function writeNote(relativePath, contents) {
  const full = resolveInVault(relativePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, contents, "utf-8");
  return full;
}

// Append a dated "## <heading>" block to a note. Creates the note with the
// provided frontmatter if it doesn't exist yet. Additive only.
export async function appendDatedBlock(relativePath, dateHeading, block, frontmatterIfNew = "") {
  const full = resolveInVault(relativePath);
  await fs.mkdir(path.dirname(full), { recursive: true });
  let existing = "";
  try {
    existing = await fs.readFile(full, "utf-8");
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  const newBlock = `## ${dateHeading}\n\n${block.trim()}\n`;
  const out = existing
    ? `${existing.trimEnd()}\n\n${newBlock}`
    : `${frontmatterIfNew ? frontmatterIfNew.trimEnd() + "\n\n" : ""}${newBlock}`;
  await fs.writeFile(full, out, "utf-8");
  return full;
}
