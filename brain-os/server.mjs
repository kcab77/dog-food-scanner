#!/usr/bin/env node
/**
 * Brain OS — localhost web app to VIEW, SEARCH, ADD, and GRAPH Kyle's Obsidian
 * "brain" (the same vault Claude Code auto-syncs into).
 *
 * Two views:
 *   - List: search + read + add notes.
 *   - Galaxy: Obsidian-style force-directed graph (nodes = notes, edges =
 *     [[wikilinks]]), colored by folder, with a TIME slider/play that reveals
 *     notes by date (Obsidian's time-lapse view).
 *
 * Why standalone: agent-os/ is locked (it holds an Apple .p8 key) so it can't
 * be edited by tooling. This reads/writes the SAME vault — same brain, separate
 * page. To embed it in agent-os, see brain-os/agent-os-snippet.md.
 *
 * Pure Node, no deps.  Run: node brain-os/server.mjs  (or ./brain-os/start.sh)
 * Opens http://localhost:4318
 */
import { createServer } from 'http'
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs'
import { join, resolve, relative, basename, dirname } from 'path'
import { homedir } from 'os'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'

const PORT = process.env.BRAIN_PORT || 4318
const VAULT = process.env.OBSIDIAN_BRAIN_VAULT || join(homedir(), 'Documents', 'Obsidian Vault')
const BRAIN = join(VAULT, 'Brain')
const INBOX = join(BRAIN, 'Inbox')
const TASKS_FILE = join(BRAIN, 'Tasks.md')

// brain-os/ lives inside the repo; agents + CLAUDE.md are one level up.
const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// --- vault helpers ---------------------------------------------------------
function listNotes() {
  const out = []
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.')) continue
      const full = join(dir, name)
      const st = statSync(full)
      if (st.isDirectory()) walk(full)
      else if (name.endsWith('.md')) {
        out.push({
          path: relative(BRAIN, full),
          folder: relative(BRAIN, dirname(full)) || '.',
          title: name.replace(/\.md$/, ''),
          mtime: st.mtime.toISOString(),
        })
      }
    }
  }
  walk(BRAIN)
  return out.sort((a, b) => b.mtime.localeCompare(a.mtime))
}

function safePath(rel) {
  const full = resolve(BRAIN, rel)
  if (full !== BRAIN && !full.startsWith(BRAIN + '/')) return null
  return full
}
function readNote(rel) {
  const full = safePath(rel)
  if (!full || !existsSync(full)) return null
  return readFileSync(full, 'utf-8')
}

// Pull a creation date from frontmatter (created/date/date_added/started) else mtime.
function noteDate(n, body) {
  const m = (body || '').match(/^(?:created|date|date_added|started):\s*["']?([0-9]{4}-[0-9]{2}-[0-9]{2})/m)
  return m ? m[1] : n.mtime.slice(0, 10)
}
const noteKey = (p) => basename(p).replace(/\.md$/i, '').toLowerCase()

function buildGraph() {
  const notes = listNotes()
  const idByKey = {}
  notes.forEach((n, i) => { idByKey[noteKey(n.path)] = i })
  const nodes = []
  const edges = []
  notes.forEach((n, i) => {
    const body = readNote(n.path) || ''
    nodes.push({
      id: i,
      title: n.title,
      path: n.path,
      folder: (n.folder.split('/')[0] || '.'),
      date: noteDate(n, body),
    })
    for (const mm of body.matchAll(/\[\[([^\]]+)\]\]/g)) {
      const key = mm[1].split('|')[0].split('#')[0].replace(/\.md$/i, '').trim().toLowerCase()
      const j = idByKey[key]
      if (j !== undefined && j !== i) edges.push({ s: i, t: j })
    }
  })
  return { nodes, edges }
}

function search(q) {
  const needle = q.toLowerCase()
  const results = []
  for (const n of listNotes()) {
    const body = readNote(n.path) || ''
    const idx = (n.title + '\n' + body).toLowerCase().indexOf(needle)
    if (idx === -1) continue
    const snippet = body.replace(/\n+/g, ' ').slice(Math.max(0, idx - 60), idx + 120).trim()
    results.push({ ...n, snippet })
  }
  return results
}

function addNote({ title, content, folder }) {
  const t = (title || '').trim() || 'Untitled note'
  const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'note'
  const targetDir = folder ? (safePath(folder) || INBOX) : INBOX
  mkdirSync(targetDir, { recursive: true })
  const date = new Date().toISOString()
  const file = join(targetDir, `${date.slice(0, 10)}-${slug}.md`)
  writeFileSync(file, [
    '---', `title: "${t.replace(/"/g, '\\"')}"`, `created: ${date}`,
    'source: brain-os', 'tags: [brain-os, captured]', '---', '', `# ${t}`, '', (content || '').trim(), '',
  ].join('\n'), 'utf-8')
  return { path: relative(BRAIN, file) }
}

// --- to-do list (stored as a markdown checklist in the vault) ---
function readTodos() {
  if (!existsSync(TASKS_FILE)) return []
  const out = []
  for (const line of readFileSync(TASKS_FILE, 'utf-8').split('\n')) {
    const m = line.match(/^- \[([ xX])\]\s+(.*)$/)
    if (m) out.push({ done: m[1].toLowerCase() === 'x', text: m[2] })
  }
  return out
}
function writeTodos(list) {
  mkdirSync(BRAIN, { recursive: true })
  const body =
    '# Tasks\n\n' +
    list.map((t) => `- [${t.done ? 'x' : ' '}] ${t.text}`).join('\n') +
    '\n'
  writeFileSync(TASKS_FILE, body, 'utf-8')
}

// --- agents: discover .claude/agents/*.md ---
function listAgents() {
  const dir = join(REPO_ROOT, '.claude', 'agents')
  if (!existsSync(dir)) return []
  const out = []
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue
    const txt = readFileSync(join(dir, f), 'utf-8')
    const name = (txt.match(/^name:\s*(.+)$/m)?.[1] || f.replace(/\.md$/, '')).trim()
    const description = (txt.match(/^description:\s*(.+)$/m)?.[1] || '').trim()
    out.push({ name, description })
  }
  return out
}

// --- agent runner: shells to the `claude` CLI on Kyle's Pro subscription ---
// We DELETE ANTHROPIC_API_KEY/ANTHROPIC_KEY from the child env so the CLI uses
// the logged-in Claude Pro plan, never pay-per-token API credits.
const jobs = new Map()

// The standalone `claude` CLI may not be on PATH (Kyle uses the VS Code
// extension). Resolve a binary: $CLAUDE_BIN override → newest bundled
// extension binary (VS Code / Cursor) → bare "claude" on PATH.
function resolveClaudeBin() {
  if (process.env.CLAUDE_BIN && existsSync(process.env.CLAUDE_BIN)) return process.env.CLAUDE_BIN
  const roots = [join(homedir(), '.vscode', 'extensions'), join(homedir(), '.cursor', 'extensions')]
  const found = []
  for (const root of roots) {
    if (!existsSync(root)) continue
    for (const d of readdirSync(root)) {
      if (!d.startsWith('anthropic.claude-code-')) continue
      const p = join(root, d, 'resources', 'native-binary', 'claude')
      if (existsSync(p)) found.push({ d, p })
    }
  }
  if (found.length) {
    found.sort((a, b) => a.d.localeCompare(b.d, undefined, { numeric: true }))
    return found[found.length - 1].p
  }
  return 'claude'
}

function runAgent(agentName, prompt) {
  const id = 'job_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
  const job = { id, agent: agentName, output: '', done: false, code: null }
  jobs.set(id, job)

  const env = { ...process.env }
  delete env.ANTHROPIC_API_KEY
  delete env.ANTHROPIC_KEY
  const fullPrompt = `Use the ${agentName} subagent to handle this request:\n\n${prompt}`
  // Full tool access (Bash, Edit, Write, etc.) with no prompts — this is a
  // local, single-user dashboard on Kyle's own machine, so agents can actually
  // run commands (curl/verify/fix), not just advise. Trade-off: a dashboard run
  // can change files and run shell commands without asking, so watch the output.
  const args = ['-p', fullPrompt, '--dangerously-skip-permissions']

  let child
  try {
    // stdio[0]='ignore' closes stdin so the CLI doesn't wait on it (the prompt
    // comes via -p, not stdin); stdout/stderr piped so we capture output.
    child = spawn(resolveClaudeBin(), args, { cwd: REPO_ROOT, env, stdio: ['ignore', 'pipe', 'pipe'] })
  } catch (e) {
    job.done = true; job.code = -1
    job.output = 'Could not launch the `claude` CLI: ' + e.message
    return id
  }
  child.stdout.on('data', (d) => { job.output += d.toString() })
  child.stderr.on('data', (d) => { job.output += d.toString() })
  child.on('error', (e) => {
    job.output += `\n[error] ${e.message}\nIs the \`claude\` CLI on your PATH and logged in (claude /login)?`
    job.done = true; job.code = -1
  })
  child.on('close', (code) => { job.done = true; job.code = code })
  return id
}

// --- http plumbing ---------------------------------------------------------
const json = (res, code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)) }
const readBody = (req) => new Promise((r) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => { try { r(JSON.parse(d || '{}')) } catch { r({}) } }) })

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  try {
    if (req.method === 'GET' && url.pathname === '/') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end(PAGE) }
    if (req.method === 'GET' && url.pathname === '/api/notes') return json(res, 200, { vault: BRAIN, notes: listNotes() })
    if (req.method === 'GET' && url.pathname === '/api/graph') return json(res, 200, buildGraph())
    if (req.method === 'GET' && url.pathname === '/api/note') {
      const body = readNote(url.searchParams.get('path') || '')
      return body == null ? json(res, 404, { error: 'not found' }) : json(res, 200, { body })
    }
    if (req.method === 'GET' && url.pathname === '/api/search') return json(res, 200, { results: search(url.searchParams.get('q') || '') })
    if (req.method === 'POST' && url.pathname === '/api/note') {
      const b = await readBody(req)
      if (!b.content && !b.title) return json(res, 400, { error: 'title or content required' })
      return json(res, 200, addNote(b))
    }
    // --- to-do ---
    if (req.method === 'GET' && url.pathname === '/api/todos') return json(res, 200, { todos: readTodos() })
    if (req.method === 'POST' && url.pathname === '/api/todos') {
      const b = await readBody(req)
      const text = (b.text || '').trim()
      if (!text) return json(res, 400, { error: 'text required' })
      const list = readTodos(); list.push({ done: false, text }); writeTodos(list)
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && url.pathname === '/api/todos/toggle') {
      const b = await readBody(req); const list = readTodos()
      if (list[b.index]) { list[b.index].done = !list[b.index].done; writeTodos(list) }
      return json(res, 200, { ok: true })
    }
    if (req.method === 'POST' && url.pathname === '/api/todos/delete') {
      const b = await readBody(req); const list = readTodos()
      if (b.index >= 0 && b.index < list.length) { list.splice(b.index, 1); writeTodos(list) }
      return json(res, 200, { ok: true })
    }
    // --- agents ---
    if (req.method === 'GET' && url.pathname === '/api/agents') return json(res, 200, { agents: listAgents() })
    if (req.method === 'POST' && url.pathname === '/api/agent/run') {
      const b = await readBody(req)
      if (!b.agent || !b.prompt) return json(res, 400, { error: 'agent and prompt required' })
      return json(res, 200, { jobId: runAgent(b.agent, b.prompt) })
    }
    if (req.method === 'GET' && url.pathname === '/api/agent/job') {
      const job = jobs.get(url.searchParams.get('id'))
      return job ? json(res, 200, job) : json(res, 404, { error: 'no such job' })
    }
    json(res, 404, { error: 'not found' })
  } catch (e) { json(res, 500, { error: String(e.message || e) }) }
})
server.listen(PORT, () => {
  console.log(`🧠 Brain OS → http://localhost:${PORT}`)
  console.log(`   vault: ${BRAIN}`)
})

// --- embedded UI -----------------------------------------------------------
const PAGE = `<!doctype html><html><head><meta charset="utf-8"><title>Brain OS</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  :root{--bg:#070912;--card:#141826;--line:#262b3d;--fg:#e9ebf2;--mut:#878da3;--acc:#7c5cff}
  *{box-sizing:border-box}html,body{margin:0;height:100%}
  body{font:15px/1.5 -apple-system,system-ui,sans-serif;background:var(--bg);color:var(--fg);overflow:hidden}
  header{padding:12px 18px;border-bottom:1px solid var(--line);display:flex;gap:14px;align-items:center}
  header h1{font-size:17px;margin:0}.mut{color:var(--mut);font-size:13px}
  .tabs{margin-left:auto;display:flex;gap:6px}
  .tab{padding:6px 14px;border:1px solid var(--line);border-radius:999px;cursor:pointer;font-size:13px;color:var(--mut)}
  .tab.on{background:var(--acc);color:#fff;border-color:var(--acc)}
  .view{position:absolute;top:51px;left:0;right:0;bottom:0}
  /* list */
  #list-view{display:grid;grid-template-columns:340px 1fr}
  .left{border-right:1px solid var(--line);overflow:auto;padding:14px}.right{overflow:auto;padding:20px}
  input,textarea{width:100%;background:var(--card);border:1px solid var(--line);color:var(--fg);border-radius:8px;padding:9px 11px;font:inherit}
  textarea{min-height:110px;resize:vertical}
  button{background:var(--acc);color:#fff;border:0;border-radius:8px;padding:8px 13px;font:inherit;font-weight:600;cursor:pointer}
  .note{padding:9px 11px;border:1px solid var(--line);border-radius:8px;margin:7px 0;cursor:pointer;background:var(--card)}
  .note:hover{border-color:var(--acc)}.note .t{font-weight:600}.note .m{color:var(--mut);font-size:12px}
  .snip{color:var(--mut);font-size:12px;margin-top:4px}
  pre{white-space:pre-wrap;word-wrap:break-word;background:var(--card);padding:16px;border-radius:10px;border:1px solid var(--line)}
  .lbl{color:var(--mut);font-size:12px;text-transform:uppercase;letter-spacing:.04em;margin:0 0 6px}.sec{margin-bottom:14px}
  /* galaxy */
  #galaxy-view{display:none}
  #cv{display:block;width:100%;height:100%;cursor:grab}
  .controls{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);display:flex;gap:12px;align-items:center;
    background:rgba(20,24,38,.85);border:1px solid var(--line);border-radius:12px;padding:10px 16px;backdrop-filter:blur(8px)}
  .controls input[type=range]{width:300px}
  #tip{position:absolute;top:14px;left:18px;color:var(--mut);font-size:12px}
  #datelabel{min-width:90px;font-variant-numeric:tabular-nums}
  #hover{position:absolute;pointer-events:none;background:rgba(20,24,38,.95);border:1px solid var(--acc);border-radius:6px;padding:4px 8px;font-size:12px;display:none}
</style></head><body>
<header><h1>🧠 Brain OS</h1><span class="mut" id="count"></span>
  <div class="tabs"><div class="tab on" id="t-list" onclick="show('list')">List</div><div class="tab" id="t-galaxy" onclick="show('galaxy')">Galaxy</div><div class="tab" id="t-todo" onclick="show('todo')">To-Do</div><div class="tab" id="t-agents" onclick="show('agents')">Agents</div><div class="tab" id="t-agentos" onclick="show('agentos')">Agent OS</div></div>
</header>

<div class="view" id="list-view">
  <div class="left">
    <div class="sec"><p class="lbl">Add a note</p>
      <input id="title" placeholder="Title">
      <textarea id="content" placeholder="What do you want to remember?"></textarea>
      <div style="margin-top:8px"><button onclick="add()">Save to vault</button></div></div>
    <div class="sec"><p class="lbl">Search</p><input id="q" placeholder="Search all notes…" oninput="runSearch()"></div>
    <div id="list"></div>
  </div>
  <div class="right"><pre id="view">Select a note, or add one. Everything here lives in your Obsidian vault.</pre></div>
</div>

<div class="view" id="galaxy-view">
  <canvas id="cv"></canvas>
  <div id="tip">drag to pan · scroll to zoom · click a star to open · drag the slider to watch your brain grow over time</div>
  <div id="hover"></div>
  <div class="controls">
    <button id="play" onclick="togglePlay()">▶ Play</button>
    <input type="range" id="time" min="0" max="100" value="100" oninput="onTime()">
    <span id="datelabel" class="mut"></span>
  </div>
</div>

<div class="view" id="agentos-view" style="display:none">
  <iframe src="http://localhost:4317" style="width:100%;height:100%;border:0"
    onerror="this.outerHTML='<p style=padding:20px;color:#878da3>agent-os isn\\'t running. Start it with ./agent-os/start.sh on port 4317.</p>'"></iframe>
</div>

<div class="view" id="todo-view" style="display:none;overflow:auto;padding:24px">
  <div style="max-width:680px">
    <p class="lbl">Add a task</p>
    <div class="row"><input id="todo-input" placeholder="What needs doing?" onkeydown="if(event.key==='Enter')addTodo()"><button onclick="addTodo()">Add</button></div>
    <div id="todo-list" style="margin-top:16px"></div>
    <p class="mut" style="margin-top:18px">Saved in your vault at <b>Brain/Tasks.md</b> — shows up in Obsidian too.</p>
  </div>
</div>

<div class="view" id="agents-view" style="display:none;overflow:auto;padding:24px">
  <div style="max-width:820px">
    <p class="lbl">Run an agent — uses your Claude Pro plan (no API credits)</p>
    <select id="agent-select" style="width:100%;background:var(--card);border:1px solid var(--line);color:var(--fg);border-radius:8px;padding:9px 11px;font:inherit"></select>
    <p id="agent-desc" class="mut" style="margin:6px 0 10px"></p>
    <textarea id="agent-prompt" placeholder="What do you want this agent to do? e.g. 'Research whether bone broth helps senior dog joints, rate the evidence' or 'Why is barcode scanning failing?'"></textarea>
    <div style="margin-top:8px"><button id="agent-run-btn" onclick="runAgentJob()">Run agent</button> <span id="agent-status" class="mut"></span></div>
    <pre id="agent-output" style="margin-top:14px;min-height:220px">Pick an agent, describe the task, hit Run. It reads your vault to learn, does the work, and writes findings back. Runs can take a minute or two.</pre>
  </div>
</div>

<script>
let notes=[], graph={nodes:[],edges:[]}
async function load(){const d=await (await fetch('/api/notes')).json();notes=d.notes;renderList(notes);document.getElementById('count').textContent=notes.length+' notes · '+d.vault}
function esc(s){return (s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}
function renderList(items){document.getElementById('list').innerHTML=items.map(n=>'<div class="note" onclick="open_(\\''+encodeURIComponent(n.path)+'\\')"><div class="t">'+esc(n.title)+'</div><div class="m">'+esc(n.folder)+' · '+n.mtime.slice(0,10)+'</div>'+(n.snippet?'<div class="snip">'+esc(n.snippet)+'</div>':'')+'</div>').join('')||'<p class="mut">No notes.</p>'}
async function open_(p){const d=await (await fetch('/api/note?path='+p)).json();document.getElementById('view').textContent=d.body||d.error}
let st;function runSearch(){clearTimeout(st);st=setTimeout(async()=>{const q=document.getElementById('q').value.trim();if(!q)return renderList(notes);const d=await (await fetch('/api/search?q='+encodeURIComponent(q))).json();renderList(d.results)},200)}
async function add(){const title=document.getElementById('title').value,content=document.getElementById('content').value;if(!title&&!content)return;await fetch('/api/note',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title,content})});document.getElementById('title').value='';document.getElementById('content').value='';load();if(graphReady)loadGraph()}

// ---------- view switching ----------
let graphReady=false
function show(v){
  for(const x of ['list','galaxy','agentos','todo','agents']){
    document.getElementById(x+'-view').style.display = v===x ? (x==='list'?'grid':'block') : 'none'
    document.getElementById('t-'+x).classList.toggle('on', v===x)
  }
  if(v==='galaxy'){ if(!graphReady){loadGraph()} else {resize()} }
  if(v==='todo') loadTodos()
  if(v==='agents' && !agentsLoaded) loadAgents()
}

// ---------- galaxy / force graph ----------
const cv=document.getElementById('cv'),ctx=cv.getContext('2d')
let N=[],E=[],dates=[],cutoff=1,cam={x:0,y:0,z:1},drag=null,hoverNode=null
const palette={}, hues=[265,150,200,40,330,95,15]
function colorFor(folder){if(!(folder in palette))palette[folder]='hsl('+hues[Object.keys(palette).length%hues.length]+' 70% 62%)';return palette[folder]}
function resize(){cv.width=cv.clientWidth*devicePixelRatio;cv.height=cv.clientHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
window.addEventListener('resize',resize)

async function loadGraph(){
  graph=await (await fetch('/api/graph')).json();graphReady=true;resize()
  const W=cv.clientWidth,H=cv.clientHeight
  N=graph.nodes.map(n=>({...n,x:W/2+(Math.random()-.5)*Math.min(W,H)*.7,y:H/2+(Math.random()-.5)*Math.min(W,H)*.7,vx:0,vy:0,deg:0}))
  E=graph.edges
  E.forEach(e=>{N[e.s].deg++;N[e.t].deg++})
  dates=[...new Set(N.map(n=>n.date))].sort()
  document.getElementById('time').value=100;cutoff=1;updateDateLabel()
  if(!raf)tick()
}
function visibleCount(){if(!dates.length)return N.length;const i=Math.floor(cutoff*(dates.length-1));const d=dates[i];return d}
function updateDateLabel(){const i=Math.floor(cutoff*(dates.length-1));document.getElementById('datelabel').textContent=dates.length?dates[i]:''}
function nodeVisible(n){if(cutoff>=1)return true;const i=Math.floor(cutoff*(dates.length-1));return n.date<=dates[i]}

let raf=null
function tick(){
  // physics
  const W=cv.clientWidth,H=cv.clientHeight
  for(let i=0;i<N.length;i++){const a=N[i];if(!nodeVisible(a))continue
    for(let j=i+1;j<N.length;j++){const b=N[j];if(!nodeVisible(b))continue
      let dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy+.01,d=Math.sqrt(d2);const f=900/d2
      const fx=dx/d*f,fy=dy/d*f;a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy}}
  for(const e of E){const a=N[e.s],b=N[e.t];if(!nodeVisible(a)||!nodeVisible(b))continue
    let dx=b.x-a.x,dy=b.y-a.y,d=Math.sqrt(dx*dx+dy*dy)+.01;const f=(d-90)*.008
    const fx=dx/d*f,fy=dy/d*f;a.vx+=fx;a.vy+=fy;b.vx-=fx;b.vy-=fy}
  for(const n of N){if(!nodeVisible(n))continue
    n.vx+=(W/2-n.x)*.0009;n.vy+=(H/2-n.y)*.0009
    n.vx*=.86;n.vy*=.86;n.x+=n.vx;n.y+=n.vy}
  // render
  ctx.clearRect(0,0,W,H)
  ctx.save();ctx.translate(cam.x,cam.y);ctx.scale(cam.z,cam.z)
  ctx.globalAlpha=.25;ctx.strokeStyle='#5560a8';ctx.lineWidth=1
  for(const e of E){const a=N[e.s],b=N[e.t];if(!nodeVisible(a)||!nodeVisible(b))continue;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
  ctx.globalAlpha=1
  for(const n of N){if(!nodeVisible(n))continue
    const r=3+Math.min(9,n.deg*1.4);ctx.beginPath();ctx.fillStyle=colorFor(n.folder)
    ctx.shadowColor=colorFor(n.folder);ctx.shadowBlur=14;ctx.arc(n.x,n.y,r,0,7);ctx.fill()}
  ctx.shadowBlur=0
  if(cam.z>1.3){ctx.fillStyle='#cfd3e6';ctx.font='11px system-ui';ctx.globalAlpha=.85
    for(const n of N){if(!nodeVisible(n))continue;ctx.fillText(n.title.slice(0,28),n.x+8,n.y+3)}ctx.globalAlpha=1}
  ctx.restore()
  raf=requestAnimationFrame(tick)
}

// interaction
function toWorld(mx,my){return{x:(mx-cam.x)/cam.z,y:(my-cam.y)/cam.z}}
cv.addEventListener('mousedown',e=>{drag={x:e.clientX,y:e.clientY,cx:cam.x,cy:cam.y,moved:false}})
window.addEventListener('mousemove',e=>{
  const rect=cv.getBoundingClientRect(),w=toWorld(e.clientX-rect.left,e.clientY-rect.top)
  hoverNode=N.find(n=>nodeVisible(n)&&Math.hypot(n.x-w.x,n.y-w.y)<8)
  const h=document.getElementById('hover')
  if(hoverNode){h.style.display='block';h.style.left=(e.clientX+12)+'px';h.style.top=(e.clientY+12)+'px';h.textContent=hoverNode.title}else h.style.display='none'
  if(drag){cam.x=drag.cx+(e.clientX-drag.x);cam.y=drag.cy+(e.clientY-drag.y);if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>4)drag.moved=true}
})
window.addEventListener('mouseup',e=>{if(drag&&!drag.moved&&hoverNode){show('list');open_(encodeURIComponent(hoverNode.path))}drag=null})
cv.addEventListener('wheel',e=>{e.preventDefault();const f=e.deltaY<0?1.1:0.9;cam.z=Math.max(.2,Math.min(5,cam.z*f))},{passive:false})

// time slider
let playing=false,playTimer=null
function onTime(){cutoff=document.getElementById('time').value/100;updateDateLabel()}
function togglePlay(){playing=!playing;document.getElementById('play').textContent=playing?'⏸ Pause':'▶ Play'
  if(playing){let v=0;document.getElementById('time').value=0;cutoff=0
    playTimer=setInterval(()=>{v+=1.2;if(v>=100){v=100;clearInterval(playTimer);playing=false;document.getElementById('play').textContent='▶ Play'}
      document.getElementById('time').value=v;cutoff=v/100;updateDateLabel()},90)}
  else clearInterval(playTimer)}

// ---------- to-do ----------
async function loadTodos(){const d=await (await fetch('/api/todos')).json();renderTodos(d.todos)}
function renderTodos(items){document.getElementById('todo-list').innerHTML=items.map((t,i)=>'<div class="note" style="display:flex;align-items:center;gap:10px"><input type="checkbox" '+(t.done?'checked':'')+' onchange="toggleTodo('+i+')"><span style="flex:1;'+(t.done?'opacity:.5;text-decoration:line-through':'')+'">'+esc(t.text)+'</span><button onclick="delTodo('+i+')" style="background:#333;padding:4px 9px">✕</button></div>').join('')||'<p class="mut">No tasks yet.</p>'}
async function addTodo(){const el=document.getElementById('todo-input');const text=el.value.trim();if(!text)return;await fetch('/api/todos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text})});el.value='';loadTodos()}
async function toggleTodo(i){await fetch('/api/todos/toggle',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({index:i})});loadTodos()}
async function delTodo(i){await fetch('/api/todos/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({index:i})});loadTodos()}

// ---------- agents ----------
let agentsLoaded=false, agentList=[], agentPoll=null
async function loadAgents(){const d=await (await fetch('/api/agents')).json();agentList=d.agents;const sel=document.getElementById('agent-select');sel.innerHTML=agentList.map(a=>'<option value="'+a.name+'">'+a.name+'</option>').join('');sel.onchange=showAgentDesc;agentsLoaded=true;showAgentDesc()}
function showAgentDesc(){const a=agentList.find(x=>x.name===document.getElementById('agent-select').value);document.getElementById('agent-desc').textContent=a?a.description:''}
async function runAgentJob(){const agent=document.getElementById('agent-select').value;const prompt=document.getElementById('agent-prompt').value.trim();if(!prompt)return;const btn=document.getElementById('agent-run-btn');btn.disabled=true;document.getElementById('agent-status').textContent='running… (Pro plan; can take a minute)';document.getElementById('agent-output').textContent='';const d=await (await fetch('/api/agent/run',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({agent,prompt})})).json();pollJob(d.jobId)}
function pollJob(id){clearInterval(agentPoll);agentPoll=setInterval(async()=>{const j=await (await fetch('/api/agent/job?id='+id)).json();if(j.output)document.getElementById('agent-output').textContent=j.output;if(j.done){clearInterval(agentPoll);document.getElementById('agent-status').textContent=j.code===0?'✓ done':'finished (exit '+j.code+')';document.getElementById('agent-run-btn').disabled=false}},2000)}

load()
</script></body></html>`
