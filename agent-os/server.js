// Agent OS — local backend. Runs ONLY on your machine (localhost).
// Holds no secrets of its own: it reads keys from common-sense-dog-ai/.env.local
// at runtime and uses them server-side. Nothing here is ever deployed or shipped.
//
// Run:  node agent-os/server.js   (or ./agent-os/start.sh)

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');
const os = require('os');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');           // repo root
const PORT = 4317;
const TODO_PATH = path.join(ROOT, 'TODO.md');
const DRAFTS_DIR = path.join(__dirname, 'drafts');

// ── Obsidian "Brain" vault (read-only) ───────────────────────────────────────
// Reads the same notes Mission Control writes to. Single source of truth = vault.
function readVaultFrom(file) {
  if (!fs.existsSync(file)) return null;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*VAULT_PATH\s*=\s*(.*)$/);
    if (m) { const v = m[1].replace(/^["']|["']$/g, '').trim(); if (v) return v; }
  }
  return null;
}
function resolveVault() {
  return (
    (process.env.VAULT_PATH && process.env.VAULT_PATH.trim()) ||        // 1. env var (highest priority)
    readVaultFrom(path.join(__dirname, '.env')) ||                      // 2. agent-os/.env
    readVaultFrom(path.join(ROOT, 'mission-control', '.env.local')) ||  // 3. Mission Control's config
    '/Users/Kyle/Documents/ObsidianVault'                              // 4. default
  );
}
const VAULT = resolveVault();
const BRAIN_DIR = path.join(VAULT, 'Brain');
const AGENTIC_DIR = path.join(VAULT, 'Agentic OS');   // shared with Mission Control
const GOALS_FILE = path.join(AGENTIC_DIR, 'Goals.md');

// ── Load keys from the existing Next.js env file (never copied elsewhere) ────
function loadEnvFile(file) {
  const env = {};
  if (fs.existsSync(file)) {
    for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim();
    }
  }
  return env;
}
// Base keys from the Next.js env; agent-os/.env layers on top (ASC creds, VAULT_PATH).
const ENV = {
  ...loadEnvFile(path.join(ROOT, 'common-sense-dog-ai', '.env.local')),
  ...loadEnvFile(path.join(__dirname, '.env')),
};
// Authoritative Supabase config = the RN app's lib/supabase.js (what production writes to).
// (.env.local's NEXT_PUBLIC_SUPABASE_URL pointed at a dead project, so don't trust it.)
function resolveSupabase() {
  try {
    const f = fs.readFileSync(path.join(ROOT, 'lib', 'supabase.js'), 'utf8');
    const u = f.match(/https:\/\/[a-z0-9]+\.supabase\.co/);
    const k = f.match(/eyJ[A-Za-z0-9_.-]+/);
    if (u && k) return { url: u[0], key: k[0] };
  } catch { /* fall through */ }
  return { url: ENV.NEXT_PUBLIC_SUPABASE_URL || 'https://dyzupdctgejwyuocqbtw.supabase.co', key: ENV.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' };
}
const _sb = resolveSupabase();
const SUPABASE_URL = _sb.url;
const SUPABASE_KEY = _sb.key;
const ANTHROPIC_KEY = ENV.ANTHROPIC_KEY || '';

// ── Helpers ──────────────────────────────────────────────────────────────────
function send(res, code, data, type = 'application/json') {
  res.writeHead(code, { 'Content-Type': type });
  res.end(type === 'application/json' ? JSON.stringify(data) : data);
}
function body(req) {
  return new Promise((resolve) => {
    let b = ''; req.on('data', (c) => (b += c));
    req.on('end', () => { try { resolve(b ? JSON.parse(b) : {}); } catch { resolve({}); } });
  });
}

// ── Supabase live stats ──────────────────────────────────────────────────────
async function sbCount(table) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: 'count=exact', Range: '0-0' },
    });
    const cr = r.headers.get('content-range') || '*/0';
    return parseInt(cr.split('/')[1] || '0', 10);
  } catch { return 0; }
}
async function getStats() {
  const [scans, feedback] = await Promise.all([sbCount('scans'), sbCount('feedback')]);
  let avgScore = null, recent = [];
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/scans?select=product_name,score,processing_method&order=scanned_at.desc&limit=8`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    });
    recent = await r.json();
    if (Array.isArray(recent) && recent.length) {
      const all = await (await fetch(`${SUPABASE_URL}/rest/v1/scans?select=score&limit=1000`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      })).json();
      const nums = (all || []).map((x) => x.score).filter((n) => typeof n === 'number');
      if (nums.length) avgScore = Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
    }
  } catch { /* ignore */ }
  return { scans, feedback, avgScore, recent: Array.isArray(recent) ? recent : [], configured: !!SUPABASE_KEY };
}

// ── Run an agent (call Claude) ───────────────────────────────────────────────
async function runAgent(prompt, model) {
  if (!ANTHROPIC_KEY) return { error: 'ANTHROPIC_KEY not found in common-sense-dog-ai/.env.local' };
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: model || 'claude-sonnet-4-6', max_tokens: 2048, messages: [{ role: 'user', content: prompt }] }),
    });
    const data = await r.json();
    if (data.error) return { error: data.error.message || 'Claude API error' };
    return { text: data?.content?.[0]?.text?.trim() || '' };
  } catch (e) { return { error: String(e) }; }
}

// ── TODO.md read/write (single source of truth) ──────────────────────────────
function readTodos() {
  if (!fs.existsSync(TODO_PATH)) return [];
  const lines = fs.readFileSync(TODO_PATH, 'utf8').split('\n');
  const out = []; let section = '';
  for (const line of lines) {
    const h = line.match(/^##+\s+(.*)/); if (h) { section = h[1].trim(); continue; }
    const t = line.match(/^\s*-\s*\[( |x|~)\]\s*(.*)/i);
    if (t) out.push({ done: t[1].toLowerCase() === 'x', text: t[2].trim(), section });
  }
  return out;
}
function toggleTodo(text) {
  if (!fs.existsSync(TODO_PATH)) return;
  const lines = fs.readFileSync(TODO_PATH, 'utf8').split('\n').map((line) => {
    const t = line.match(/^(\s*-\s*)\[( |x|~)\](\s*)(.*)/i);
    if (t && t[4].trim() === text.trim()) {
      const next = t[2].toLowerCase() === 'x' ? ' ' : 'x';
      return `${t[1]}[${next}]${t[3]}${t[4]}`;
    }
    return line;
  });
  fs.writeFileSync(TODO_PATH, lines.join('\n'));
}
function addTodo(text) {
  let content = fs.existsSync(TODO_PATH) ? fs.readFileSync(TODO_PATH, 'utf8') : '# To-Do\n';
  // insert under the first "## " section, else append
  const idx = content.indexOf('\n## ');
  const line = `- [ ] ${text}\n`;
  if (idx >= 0) {
    const after = content.indexOf('\n', idx + 1);
    content = content.slice(0, after + 1) + line + content.slice(after + 1);
  } else { content += `\n${line}`; }
  fs.writeFileSync(TODO_PATH, content);
}

// ── Save a draft article ─────────────────────────────────────────────────────
function saveDraft(title, content) {
  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  const slug = (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
  const file = path.join(DRAFTS_DIR, `${slug || 'draft'}-${Date.now()}.md`);
  fs.writeFileSync(file, `# ${title}\n\n${content}\n`);
  return path.relative(ROOT, file);
}

// ── Push a draft into Pinecone via the EXISTING pipeline (costs API $) ────────
function pushToPinecone(relPath) {
  return new Promise((resolve) => {
    const script = path.join(ROOT, 'common-sense-dog-ai', 'scripts', 'process_content.mjs');
    if (!fs.existsSync(script)) return resolve({ error: 'process_content.mjs not found' });
    const child = spawn('node', [script, path.join(ROOT, relPath)], { cwd: path.join(ROOT, 'common-sense-dog-ai'), env: { ...process.env, ...ENV } });
    let log = '';
    child.stdout.on('data', (d) => (log += d));
    child.stderr.on('data', (d) => (log += d));
    child.on('close', (code) => resolve({ ok: code === 0, log: log.slice(-2000) }));
  });
}

// ── Goals + Journal (write to the Obsidian vault's "Agentic OS" folder) ──────
function ensureAgentic() { if (!fs.existsSync(AGENTIC_DIR)) fs.mkdirSync(AGENTIC_DIR, { recursive: true }); }
function pad(n) { return String(n).padStart(2, '0'); }
function todayName(d = new Date()) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function hhmm(d = new Date()) { return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function readGoals() {
  if (!fs.existsSync(GOALS_FILE)) return [];
  const out = [];
  for (const line of fs.readFileSync(GOALS_FILE, 'utf8').split('\n')) {
    const t = line.match(/^\s*-\s*\[( |x)\]\s*(.*)/i);
    if (t) out.push({ done: t[1].toLowerCase() === 'x', text: t[2].trim() });
  }
  return out;
}
function addGoal(text) {
  ensureAgentic();
  let c = fs.existsSync(GOALS_FILE) ? fs.readFileSync(GOALS_FILE, 'utf8') : '# Goals\n\n';
  if (!c.endsWith('\n')) c += '\n';
  fs.writeFileSync(GOALS_FILE, c + `- [ ] ${text}\n`);
}
function toggleGoal(text) {
  if (!fs.existsSync(GOALS_FILE)) return;
  const lines = fs.readFileSync(GOALS_FILE, 'utf8').split('\n').map((line) => {
    const t = line.match(/^(\s*-\s*)\[( |x)\](\s*)(.*)/i);
    if (t && t[4].trim() === text.trim()) return `${t[1]}[${t[2].toLowerCase() === 'x' ? ' ' : 'x'}]${t[3]}${t[4]}`;
    return line;
  });
  fs.writeFileSync(GOALS_FILE, lines.join('\n'));
}

function journalFile() { return path.join(AGENTIC_DIR, `${todayName()}.md`); }
function ensureJournal() {
  ensureAgentic();
  const f = journalFile();
  if (!fs.existsSync(f)) fs.writeFileSync(f, `---\ndate: ${todayName()}\ntype: agentic-os-log\n---\n\n# ${todayName()}\n`);
  return f;
}
function addJournal(text) {
  const f = ensureJournal();
  fs.appendFileSync(f, `\n## ${hhmm()} · 📓 Journal\n\n${text}\n`);
  return fs.readFileSync(f, 'utf8');
}
function readJournalToday() {
  const f = journalFile();
  return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '';
}

// ── Brain (Obsidian vault) read-only browser ─────────────────────────────────
function listBrain() {
  const out = [];
  (function walk(dir, rel) {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, name);
      const r = rel ? `${rel}/${name}` : name;
      if (fs.statSync(full).isDirectory()) walk(full, r);
      else if (name.endsWith('.md')) out.push({ path: r, name: name.replace(/\.md$/, ''), folder: rel });
    }
  })(BRAIN_DIR, '');
  return out;
}
function readBrainNote(rel) {
  const full = path.resolve(BRAIN_DIR, rel || '');
  // stay inside BRAIN_DIR, .md only — no path traversal
  if (!full.startsWith(BRAIN_DIR + path.sep) || !full.endsWith('.md') || !fs.existsSync(full)) return null;
  return fs.readFileSync(full, 'utf8');
}

// ── GitHub (via the gh CLI — `gh auth login` once, then read-only) ───────────
const GH_BIN = ['/usr/local/bin/gh', '/opt/homebrew/bin/gh'].find((p) => fs.existsSync(p)) || 'gh';
function runGh(args) {
  return new Promise((resolve) => {
    const child = spawn(GH_BIN, args, { env: { ...process.env } });
    let out = '', err = '';
    const t = setTimeout(() => { child.kill('SIGKILL'); resolve({ error: 'gh timed out' }); }, 25000);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => { clearTimeout(t); resolve({ error: String(e) }); });
    child.on('close', (code) => {
      clearTimeout(t);
      if (code !== 0) return resolve({ error: (err || out || `gh exited ${code}`).trim().slice(-400) });
      try { resolve({ data: JSON.parse(out || 'null') }); } catch { resolve({ error: 'gh: bad JSON' }); }
    });
  });
}
async function githubInfo() {
  const who = await runGh(['api', 'user', '--jq', '{login:.login,name:.name,avatar:.avatar_url,public_repos:.public_repos,followers:.followers}']);
  if (who.error) return { authed: false, error: /not logged|authentication|gh auth/i.test(who.error) ? 'not_logged_in' : who.error };
  const repos = await runGh(['repo', 'list', '--json', 'name,description,pushedAt,url,isPrivate,stargazerCount,primaryLanguage', '--limit', '30']);
  return { authed: true, user: who.data, repos: (repos.data || []) };
}

// ── Supabase browser (list tables + recent rows) ─────────────────────────────
async function sbTables() {
  let names = [];
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (r.ok) { const j = await r.json(); names = Object.keys(j.definitions || (j.components && j.components.schemas) || {}); }
  } catch { /* ignore */ }
  names = names.filter((n) => n && !n.startsWith('_'));
  if (!names.length) names = ['scans', 'feedback', 'products'];
  return Promise.all(names.map(async (t) => ({ table: t, count: await sbCount(t) })));
}
async function sbRows(table, limit) {
  if (!/^[a-zA-Z0-9_]+$/.test(table)) return { error: 'invalid table name' };
  let order = '';
  try {
    const s = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=1`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (s.ok) { const a = await s.json(); if (a[0]) { const tc = Object.keys(a[0]).find((k) => /(_at|created|updated|time|date)/i.test(k)); if (tc) order = `&order=${tc}.desc`; } }
  } catch { /* ignore */ }
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*${order}&limit=${limit}`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
  if (!r.ok) return { error: `HTTP ${r.status}: ${(await r.text()).slice(0, 160)}` };
  const rows = await r.json();
  return { table, rows: Array.isArray(rows) ? rows : [], ordered: !!order };
}

// ── Pinecone quick-add (embed one note with voyage-3 → upsert to the KB) ─────
const PINECONE_KEY = ENV.PINECONE_API_KEY;
const PINECONE_INDEX = ENV.PINECONE_INDEX || 'dog-knowledge-database';
const VOYAGE_KEY = ENV.VOYAGE_API_KEY;
let _pineconeHost = null;
async function pineconeHost() {
  if (_pineconeHost) return _pineconeHost;
  const r = await fetch(`https://api.pinecone.io/indexes/${PINECONE_INDEX}`, { headers: { 'Api-Key': PINECONE_KEY } });
  if (!r.ok) throw new Error(`index info ${r.status}: ${(await r.text()).slice(0, 160)}`);
  _pineconeHost = (await r.json()).host;
  return _pineconeHost;
}
async function voyageEmbed(text) {
  const r = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${VOYAGE_KEY}` },
    body: JSON.stringify({ model: 'voyage-3', input: text }), // 1024-dim — matches the index + chat
  });
  const d = await r.json();
  if (!d.data || !d.data[0] || !d.data[0].embedding) throw new Error(`voyage: ${JSON.stringify(d).slice(0, 200)}`);
  return d.data[0].embedding;
}
async function pineconeAdd(text, tag) {
  if (!PINECONE_KEY || !VOYAGE_KEY) return { error: 'Missing PINECONE_API_KEY or VOYAGE_API_KEY in common-sense-dog-ai/.env.local' };
  try {
    const values = await voyageEmbed(text);
    const host = await pineconeHost();
    const id = `note-${Date.now()}`;
    const metadata = { text, tag: tag || 'Note', source: 'agent-os', added_at: new Date().toISOString() };
    const r = await fetch(`https://${host}/vectors/upsert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Api-Key': PINECONE_KEY },
      body: JSON.stringify({ vectors: [{ id, values, metadata }] }),
    });
    if (!r.ok) return { error: `pinecone upsert ${r.status}: ${(await r.text()).slice(0, 200)}` };
    return { ok: true, id, dim: values.length };
  } catch (e) { return { error: String(e) }; }
}

// ── Hermes agent (talk to it via oneshot: `hermes -z "msg"`) ─────────────────
const HERMES_BIN = path.join(os.homedir(), '.local', 'bin', 'hermes');
function runHermes(message) {
  return new Promise((resolve) => {
    if (!fs.existsSync(HERMES_BIN)) return resolve({ error: 'Hermes not found at ~/.local/bin/hermes — finish `hermes setup` first.' });
    const child = spawn(HERMES_BIN, ['-z', message], { env: { ...process.env } });
    let out = '', err = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); resolve({ error: 'Hermes timed out (180s).' }); }, 180000);
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => { clearTimeout(timer); resolve({ error: String(e) }); });
    child.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0 && out.trim()) return resolve({ reply: out.trim() });
      resolve({ error: (err.trim() || out.trim() || `hermes exited with code ${code}`).slice(-1500) });
    });
  });
}

// ── App Store Connect (live download stats via Sales & Trends) ───────────────
function ascConfig() {
  const keyId = ENV.ASC_KEY_ID, issuerId = ENV.ASC_ISSUER_ID, vendorNumber = ENV.ASC_VENDOR_NUMBER;
  let privateKey = ENV.ASC_PRIVATE_KEY || '';
  if (!privateKey && ENV.ASC_PRIVATE_KEY_PATH) {
    const p = path.isAbsolute(ENV.ASC_PRIVATE_KEY_PATH) ? ENV.ASC_PRIVATE_KEY_PATH : path.join(__dirname, ENV.ASC_PRIVATE_KEY_PATH);
    if (fs.existsSync(p)) privateKey = fs.readFileSync(p, 'utf8');
  }
  const missing = [];
  if (!keyId) missing.push('ASC_KEY_ID');
  if (!issuerId) missing.push('ASC_ISSUER_ID');
  if (!vendorNumber) missing.push('ASC_VENDOR_NUMBER');
  if (!privateKey) missing.push('ASC_PRIVATE_KEY_PATH');
  return { keyId, issuerId, vendorNumber, privateKey, ok: missing.length === 0, missing };
}
// ES256-signed JWT for the App Store Connect API (no external libs).
function ascToken(cfg) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const input = `${b64({ alg: 'ES256', kid: cfg.keyId, typ: 'JWT' })}.${b64({ iss: cfg.issuerId, iat: now, exp: now + 60 * 15, aud: 'appstoreconnect-v1' })}`;
  const sig = crypto.sign('SHA256', Buffer.from(input), { key: cfg.privateKey, dsaEncoding: 'ieee-p1363' });
  return `${input}.${sig.toString('base64url')}`;
}
// One day's SALES SUMMARY report → app download units (excludes in-app purchases).
async function ascSales(cfg, token, dateStr) {
  const params = new URLSearchParams({
    'filter[frequency]': 'DAILY',
    'filter[reportType]': 'SALES',
    'filter[reportSubType]': 'SUMMARY',
    'filter[vendorNumber]': cfg.vendorNumber,
    'filter[reportDate]': dateStr,
    'filter[version]': '1_0',
  });
  let r;
  try {
    r = await fetch(`https://api.appstoreconnect.apple.com/v1/salesReports?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/a-gzip' },
    });
  } catch (e) { return { date: dateStr, units: 0, error: String(e) }; }
  if (r.status === 404) return { date: dateStr, units: 0 };           // no sales that day
  if (!r.ok) { const t = await r.text().catch(() => ''); return { date: dateStr, units: 0, error: `HTTP ${r.status} ${t.slice(0, 160)}` }; }
  let tsv;
  try { tsv = zlib.gunzipSync(Buffer.from(await r.arrayBuffer())).toString('utf8'); }
  catch (e) { return { date: dateStr, units: 0, error: 'gunzip ' + e.message }; }
  const lines = tsv.split('\n').filter(Boolean);
  if (lines.length < 2) return { date: dateStr, units: 0 };
  const head = lines[0].split('\t');
  const uIdx = head.indexOf('Units');
  const pIdx = head.indexOf('Product Type Identifier');
  let units = 0;
  for (let i = 1; i < lines.length; i++) {
    const c = lines[i].split('\t');
    const pti = (pIdx >= 0 ? c[pIdx] : '') || '';
    if (pti.startsWith('IA') || pti.startsWith('FI')) continue;       // skip in-app purchases
    units += parseInt(c[uIdx] || '0', 10) || 0;
  }
  return { date: dateStr, units };
}
async function ascDownloads(days) {
  const cfg = ascConfig();
  if (!cfg.ok) return { configured: false, missing: cfg.missing };
  let token;
  try { token = ascToken(cfg); }
  catch (e) { return { configured: true, error: 'Could not sign token — check the .p8 key. (' + e.message + ')' }; }
  const dates = [];
  for (let i = 1; i <= days; i++) { const d = new Date(); d.setDate(d.getDate() - i); dates.push(d.toISOString().slice(0, 10)); }
  const results = await Promise.all(dates.map(d => ascSales(cfg, token, d)));
  const series = results.map(r => ({ date: r.date, units: r.units })).sort((a, b) => a.date < b.date ? -1 : 1);
  const total = series.reduce((s, r) => s + r.units, 0);
  const err = results.find(r => r.error);
  return { configured: true, vendor: cfg.vendorNumber, days, total, series, error: err && err.error };
}

// ── Router ───────────────────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/stats') return send(res, 200, await getStats());
  if (url.pathname === '/api/todos' && req.method === 'GET') return send(res, 200, readTodos());
  if (url.pathname === '/api/todos' && req.method === 'POST') {
    const b = await body(req);
    if (b.action === 'toggle') toggleTodo(b.text);
    if (b.action === 'add') addTodo(b.text);
    return send(res, 200, readTodos());
  }
  if (url.pathname === '/api/run-agent' && req.method === 'POST') {
    const b = await body(req); return send(res, 200, await runAgent(b.prompt, b.model));
  }
  if (url.pathname === '/api/save-draft' && req.method === 'POST') {
    const b = await body(req); return send(res, 200, { path: saveDraft(b.title, b.content) });
  }
  if (url.pathname === '/api/drafts' && req.method === 'GET') {
    if (!fs.existsSync(DRAFTS_DIR)) return send(res, 200, []);
    const list = fs.readdirSync(DRAFTS_DIR).filter((f) => f.endsWith('.md'))
      .map((f) => ({ name: f, path: path.relative(ROOT, path.join(DRAFTS_DIR, f)) }));
    return send(res, 200, list);
  }
  if (url.pathname === '/api/push-pinecone' && req.method === 'POST') {
    const b = await body(req); return send(res, 200, await pushToPinecone(b.path));
  }
  if (url.pathname === '/api/brain' && req.method === 'GET') {
    return send(res, 200, { dir: BRAIN_DIR, exists: fs.existsSync(BRAIN_DIR), notes: listBrain() });
  }
  if (url.pathname === '/api/brain-note' && req.method === 'GET') {
    const content = readBrainNote(url.searchParams.get('file'));
    if (content == null) return send(res, 404, { error: 'note not found' });
    return send(res, 200, { content });
  }
  if (url.pathname === '/api/goals' && req.method === 'GET') return send(res, 200, readGoals());
  if (url.pathname === '/api/goals' && req.method === 'POST') {
    const b = await body(req);
    if (b.action === 'add' && b.text && b.text.trim()) addGoal(b.text.trim());
    if (b.action === 'toggle') toggleGoal(b.text);
    return send(res, 200, readGoals());
  }
  if (url.pathname === '/api/journal' && req.method === 'GET') {
    return send(res, 200, { date: todayName(), content: readJournalToday() });
  }
  if (url.pathname === '/api/journal' && req.method === 'POST') {
    const b = await body(req);
    if (!b.text || !b.text.trim()) return send(res, 400, { error: 'empty' });
    return send(res, 200, { ok: true, date: todayName(), content: addJournal(b.text.trim()) });
  }
  if (url.pathname === '/api/appstore' && req.method === 'GET') {
    const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || '14', 10) || 14, 1), 35);
    return send(res, 200, await ascDownloads(days));
  }
  if (url.pathname === '/api/hermes' && req.method === 'GET') {
    return send(res, 200, { installed: fs.existsSync(HERMES_BIN) });
  }
  if (url.pathname === '/api/hermes' && req.method === 'POST') {
    const b = await body(req);
    if (!b.message || !b.message.trim()) return send(res, 400, { error: 'empty' });
    return send(res, 200, await runHermes(b.message.trim()));
  }
  if (url.pathname === '/api/github' && req.method === 'GET') {
    return send(res, 200, await githubInfo());
  }
  if (url.pathname === '/api/supabase/tables' && req.method === 'GET') {
    return send(res, 200, { project: SUPABASE_URL, configured: !!SUPABASE_KEY, tables: await sbTables() });
  }
  if (url.pathname === '/api/supabase/rows' && req.method === 'GET') {
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '25', 10) || 25, 1), 100);
    return send(res, 200, await sbRows(url.searchParams.get('table') || '', limit));
  }
  if (url.pathname === '/api/pinecone-add' && req.method === 'GET') {
    return send(res, 200, { configured: !!(PINECONE_KEY && VOYAGE_KEY), index: PINECONE_INDEX });
  }
  if (url.pathname === '/api/pinecone-add' && req.method === 'POST') {
    const b = await body(req);
    if (!b.text || !b.text.trim()) return send(res, 400, { error: 'empty' });
    return send(res, 200, await pineconeAdd(b.text.trim(), b.tag));
  }

  // static
  let file = url.pathname === '/' ? '/index.html' : url.pathname;
  const full = path.join(__dirname, file);
  if (full.startsWith(__dirname) && fs.existsSync(full) && fs.statSync(full).isFile()) {
    const ext = path.extname(full);
    const type = ext === '.html' ? 'text/html' : ext === '.js' ? 'text/javascript' : 'text/plain';
    return send(res, 200, fs.readFileSync(full, 'utf8'), type);
  }
  send(res, 404, 'Not found', 'text/plain');
});

server.listen(PORT, () => {
  console.log(`\n🐾 Agent OS running at http://localhost:${PORT}  (Ctrl+C to stop)`);
  console.log(`   Keys loaded from common-sense-dog-ai/.env.local:`);
  console.log(`   • Claude:   ${ANTHROPIC_KEY ? 'yes ✅' : 'NOT FOUND ❌'}`);
  console.log(`   • Supabase: ${SUPABASE_KEY ? 'yes ✅' : 'NOT FOUND ❌'}`);
  console.log(`   • Vault:    ${VAULT}  ${fs.existsSync(VAULT) ? '✅' : '❌ (path not found)'}`);
  console.log(`   • App Store: ${ascConfig().ok ? 'configured ✅' : 'not set up (add ASC_* to agent-os/.env)'}\n`);
});
