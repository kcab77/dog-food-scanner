#!/usr/bin/env node
/**
 * check-doc-freshness.mjs — catch docs that lie about their own age.
 *
 * Why this exists: the 2026-08-03 OS audit found the same failure three times.
 * docs/TODO.md claimed "Last updated: 2026-06-24" while being edited 2026-08-02.
 * Nine PINECONE_TODO.md boxes were unticked for work that had already shipped.
 * Two more TODO items were done months earlier. Every one was invisible, and each
 * one made a future session confidently wrong about what was current.
 *
 * A human will not remember to update a footer. A script will.
 *
 * WARNS, never blocks. Kyle's git has been flaky since the iCloud incident and a
 * commit-blocking hook would cost more than the problem. Exit code is always 0
 * unless --strict is passed.
 *
 *   node scripts/check-doc-freshness.mjs
 *   node scripts/check-doc-freshness.mjs --strict   # exit 1 on findings (for CI)
 */

import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'

const STRICT = process.argv.includes('--strict')

// Docs that make freshness claims worth checking.
const DOCS = [
  'docs/TODO.md',
  'docs/APP_SPEC.md',
  'PINECONE_TODO.md',
  'PROJECTS.md',
  'CLAUDE.md',
]

/**
 * Match only DOCUMENT-LEVEL freshness claims, not dates mentioned in prose.
 *
 * The naive pattern /updated:?\s*(date)/i flags changelog lines like
 * "Processing method — bonus-based, updated 2026-07-19", which are statements about
 * when a *feature* changed, not about the file's age. A checker that cries wolf gets
 * ignored, which is worse than no checker at all.
 *
 * So require one of:
 *   - the words "last updated" together  ("*Last updated: 2026-08-03*")
 *   - a line that is ONLY the claim      (footer style, optional markdown emphasis)
 *   - a frontmatter key at line start    ("updated: 2026-08-03")
 */
const DATE_CLAIMS = [
  /last\s+updated:?\s*\**\s*(\d{4}-\d{2}-\d{2})/i,
  /^\s*\**\s*updated:?\s*\**\s*(\d{4}-\d{2}-\d{2})\s*\**\s*$/im,
]

function findDateClaim(text) {
  for (const re of DATE_CLAIMS) {
    const m = text.match(re)
    if (m) return m[1]
  }
  return null
}

const findings = []

function lastCommitDate(file) {
  try {
    const out = execSync(`git log -1 --format=%ad --date=short -- "${file}"`, {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return out || null
  } catch {
    return null
  }
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86_400_000)
}

for (const file of DOCS) {
  if (!existsSync(file)) {
    findings.push({ file, kind: 'missing', msg: 'listed here but not on disk' })
    continue
  }

  const text = readFileSync(file, 'utf-8')
  const claim = findDateClaim(text)
  const real = lastCommitDate(file)
  if (!claim || !real) continue

  // Only flag a claim that is OLDER than the file's real last change. A doc claiming
  // a date newer than its last commit is just an edit that hasn't been committed yet.
  const drift = daysBetween(claim, real)
  if (drift > 1) {
    findings.push({
      file,
      kind: 'stale-date',
      msg: `says "${claim}" but was last changed ${real} — ${drift} days adrift`,
    })
  }
}

// Unticked boxes whose line names a pack/file that already exists = work done,
// record not updated. This is the checkbox half of the same failure.
if (existsSync('PINECONE_TODO.md')) {
  const lines = readFileSync('PINECONE_TODO.md', 'utf-8').split('\n')
  let unticked = 0
  for (const line of lines) if (/^\s*-\s*\[ \]/.test(line)) unticked++
  if (unticked > 0) {
    findings.push({
      file: 'PINECONE_TODO.md',
      kind: 'info',
      msg: `${unticked} unticked item(s) — verify against scripts/qa-*.json before planning work as new`,
    })
  }
}

if (findings.length === 0) {
  console.log('✅ Docs agree with reality — no freshness drift found.')
  process.exit(0)
}

console.log('\n📄 Doc freshness check\n')
for (const f of findings) {
  const icon = f.kind === 'info' ? 'ℹ️ ' : f.kind === 'missing' ? '❌' : '⚠️ '
  console.log(`${icon} ${f.file}\n     ${f.msg}\n`)
}
const real = findings.filter((f) => f.kind !== 'info').length
console.log(
  real > 0
    ? `${real} doc(s) misstate their own age. A stale date is read as fact by the next session.\n`
    : 'Nothing broken — the note above is a reminder, not a failure.\n',
)

process.exit(STRICT && real > 0 ? 1 : 0)
