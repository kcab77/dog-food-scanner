#!/usr/bin/env node
/**
 * Who scanned what — a read-only report on the `scans` table.
 *
 * `scans` has NO select policy (see supabase/migrations/20260722_rls_hardening.sql:37),
 * which is deliberate: the anon key the app ships with must never be able to read
 * other people's scans. So this report needs the service-role key, which is why it
 * lives here as a script you run rather than anything the app can do.
 *
 * Get the key: Supabase dashboard -> Project Settings -> API -> `service_role`.
 * Then run (note the leading space, so it stays out of your shell history):
 *
 *    SUPABASE_SERVICE_KEY='eyJ...' node scripts/scan-report.mjs
 *    SUPABASE_SERVICE_KEY='eyJ...' node scripts/scan-report.mjs --days 30 --include-dev
 *
 * Never commit the key and never put it in .env with an EXPO_PUBLIC_ prefix —
 * that prefix bakes it into the app bundle, where it is extractable.
 */

const URL = 'https://dyzupdctgejwyuocqbtw.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_KEY;

if (!KEY) {
  console.error('\n  Missing SUPABASE_SERVICE_KEY.\n');
  console.error('  Supabase dashboard -> Project Settings -> API -> service_role, then:');
  console.error("    SUPABASE_SERVICE_KEY='eyJ...' node scripts/scan-report.mjs\n");
  process.exit(1);
}

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const days = Number(flag('days', 90));
const includeDev = args.includes('--include-dev');

async function fetchAll(table, query) {
  // PostgREST caps a response at 1000 rows, so page until a short page comes back.
  const out = [];
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${URL}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: KEY,
        Authorization: `Bearer ${KEY}`,
        Range: `${from}-${from + 999}`,
      },
    });
    if (!res.ok) throw new Error(`${table} ${res.status}: ${await res.text()}`);
    const page = await res.json();
    out.push(...page);
    if (page.length < 1000) return out;
  }
}

const since = new Date(Date.now() - days * 86400e3).toISOString();
const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : '—');
const bar = (n, max, w = 24) => '█'.repeat(Math.max(1, Math.round((n / max) * w)));

function tally(rows, keyFn) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r) ?? '(none)';
    m.set(k, (m.get(k) || 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function section(title) {
  console.log(`\n\x1b[1m${title}\x1b[0m`);
  console.log('─'.repeat(title.length));
}

const all = await fetchAll('scans', `select=*&scanned_at=gte.${since}&order=scanned_at.desc`);
const rows = includeDev ? all : all.filter((r) => !r.is_dev);
const devCount = all.length - rows.length;

console.log(`\n\x1b[1m\x1b[36mPawGrade scan report\x1b[0m  ·  last ${days} days  ·  ${new Date().toISOString().slice(0, 10)}`);

if (!all.length) {
  console.log(`\nNo scans in the last ${days} days. Try a wider window: --days 365\n`);
  process.exit(0);
}

// ── Who ──────────────────────────────────────────────────────────────────
section('Who');
const signedIn = rows.filter((r) => r.user_id);
const users = new Set(signedIn.map((r) => r.user_id));
console.log(`real scans         ${rows.length}${devCount ? `   (+${devCount} dev/simulator, hidden — pass --include-dev)` : ''}`);
console.log(`signed-in scans    ${signedIn.length}  (${pct(signedIn.length, rows.length)})`);
console.log(`anonymous scans    ${rows.length - signedIn.length}  (${pct(rows.length - signedIn.length, rows.length)})`);
console.log(`distinct accounts  ${users.size}`);

if (users.size) {
  console.log('\nby account (scans · first seen · last seen):');
  const byUser = new Map();
  for (const r of signedIn) {
    const u = byUser.get(r.user_id) ?? { n: 0, first: r.scanned_at, last: r.scanned_at };
    u.n++;
    if (r.scanned_at < u.first) u.first = r.scanned_at;
    if (r.scanned_at > u.last) u.last = r.scanned_at;
    byUser.set(r.user_id, u);
  }
  for (const [id, u] of [...byUser.entries()].sort((a, b) => b[1].n - a[1].n).slice(0, 25)) {
    console.log(`  ${id.slice(0, 8)}…  ${String(u.n).padStart(4)}   ${u.first.slice(0, 10)} → ${u.last.slice(0, 10)}`);
  }
}

// ── When ─────────────────────────────────────────────────────────────────
section('When');
const byDay = tally(rows, (r) => r.scanned_at?.slice(0, 10)).sort((a, b) => a[0].localeCompare(b[0]));
const maxDay = Math.max(...byDay.map((d) => d[1]));
for (const [day, n] of byDay.slice(-21)) {
  console.log(`  ${day}  ${String(n).padStart(4)}  ${bar(n, maxDay)}`);
}

// ── How ──────────────────────────────────────────────────────────────────
section('How');
for (const [label, fn] of [['method', (r) => r.scan_method], ['platform', (r) => r.platform]]) {
  console.log(`${label}:`);
  for (const [k, n] of tally(rows, fn)) console.log(`  ${String(k).padEnd(18)} ${String(n).padStart(4)}  ${pct(n, rows.length)}`);
}

// ── What ─────────────────────────────────────────────────────────────────
section('What they scanned');
const byProduct = tally(rows, (r) => r.product_name);
console.log(`${byProduct.length} distinct products\n`);
for (const [name, n] of byProduct.slice(0, 30)) {
  console.log(`  ${String(n).padStart(3)}×  ${String(name).slice(0, 62)}`);
}

// ── Scores ───────────────────────────────────────────────────────────────
section('Scores they saw');
const scored = rows.filter((r) => typeof r.score === 'number');
if (scored.length) {
  const scores = scored.map((r) => r.score).sort((a, b) => a - b);
  const median = scores[Math.floor(scores.length / 2)];
  const mean = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  console.log(`mean ${mean}  ·  median ${median}  ·  range ${scores[0]}–${scores.at(-1)}\n`);
  // Bands straight from lib/theme.ts scoreLabel() — keep in sync if those move.
  const bands = [
    ['85-100  Excellent    ', (s) => s >= 85],
    ['70-84   Good         ', (s) => s >= 70 && s < 85],
    ['50-69   Fair         ', (s) => s >= 50 && s < 70],
    ['30-49   Below Average', (s) => s >= 30 && s < 50],
    ['  <30   Low Quality  ', (s) => s < 30],
  ];
  const maxBand = Math.max(...bands.map(([, t]) => scores.filter(t).length));
  for (const [label, test] of bands) {
    const n = scores.filter(test).length;
    console.log(`  ${label} ${String(n).padStart(4)}  ${pct(n, scored.length).padStart(4)}  ${n ? bar(n, maxBand, 20) : ''}`);
  }
}

section('Processing methods detected');
for (const [k, n] of tally(rows, (r) => r.processing_method)) {
  console.log(`  ${String(k).padEnd(18)} ${String(n).padStart(4)}  ${pct(n, rows.length)}`);
}

// ── Feedback ─────────────────────────────────────────────────────────────
try {
  const fb = await fetchAll('feedback', `select=*&order=created_at.desc`);
  section(`Feedback (${fb.length})`);
  for (const f of fb.slice(0, 15)) {
    console.log(`  ${(f.created_at ?? '').slice(0, 10)}  ${String(f.message ?? '').replace(/\s+/g, ' ').slice(0, 90)}`);
  }
  if (!fb.length) console.log('  (none yet)');
} catch (e) {
  console.log(`\n  feedback unreadable: ${e.message}`);
}

console.log('');
