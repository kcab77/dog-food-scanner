'use client'

import { useState, useRef, useEffect } from 'react'
import { renderMarkdown } from '@/lib/markdown'

type Msg = { role: 'user' | 'assistant'; content: string }

const STARTERS = [
  'Is grain-free safe?',
  "What's a good senior dog food?",
  'What ingredients should I avoid?',
  "Help me pick a food for my dog's allergies.",
]

// Prominent, homepage-first chat. Uses the existing /api/chat endpoint (same
// request/response shape as the /chat page) — no API changes.
export default function HomeChat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const content = text.trim()
    if (!content || loading) return
    const next: Msg[] = [...messages, { role: 'user', content }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })
      const data = await res.json()
      setMessages([...next, { role: 'assistant', content: data.message || data.error || "Sorry, I couldn't answer that right now — please try again." }])
    } catch {
      setMessages([...next, { role: 'assistant', content: "Sorry, I couldn't connect right now — please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const started = messages.length > 0

  return (
    <div className="chatwrap" id="ask">
      <style jsx>{`
        .chatwrap { width: 100%; max-width: 720px; margin: 0 auto; background: var(--white, #fff); border: 1px solid var(--border, #E2D9CA); border-radius: 22px; box-shadow: 0 14px 44px rgba(42,92,46,.10); overflow: hidden; display: flex; flex-direction: column; }
        .thread { padding: 20px; display: flex; flex-direction: column; gap: 14px; max-height: 52vh; overflow-y: auto; }
        .empty { text-align: center; padding: 14px 16px 4px; color: var(--text-muted, #7A746B); font-size: 15px; }
        .row { display: flex; gap: 10px; align-items: flex-start; }
        .row.user { justify-content: flex-end; }
        .avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--green-pale, #EDF4EE); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
        .bubble { max-width: 80%; padding: 12px 15px; font-size: 15px; line-height: 1.65; border-radius: 16px; }
        .bubble.user { background: var(--green, #2A5C2E); color: #fff; border-bottom-right-radius: 5px; }
        .bubble.bot { background: var(--cream, #FDFAF5); color: #2B2A26; border: 1px solid var(--border, #E2D9CA); border-bottom-left-radius: 5px; }
        .bubble.bot :global(h1), .bubble.bot :global(h2) { font-size: 16px; font-weight: 700; margin: 12px 0 5px; color: var(--green, #2A5C2E); }
        .bubble.bot :global(h3) { font-size: 14px; font-weight: 700; margin: 10px 0 4px; }
        .bubble.bot :global(p) { margin: 0 0 9px; }
        .bubble.bot :global(ul), .bubble.bot :global(ol) { margin: 0 0 9px 18px; }
        .bubble.bot :global(li) { margin-bottom: 4px; }
        .bubble.bot :global(strong) { color: #111; }
        .bubble.bot :global(a) { color: var(--green, #2A5C2E); text-decoration: underline; }
        .bubble.bot :global(em) { color: #888; font-size: 13px; }
        .bubble.bot :global(> :first-child) { margin-top: 0; }
        .bubble.bot :global(> :last-child) { margin-bottom: 0; }
        .typing { color: var(--text-muted, #7A746B); font-size: 14px; font-style: italic; padding: 2px 4px; }
        .composer { border-top: 1px solid var(--border, #E2D9CA); padding: 14px; background: var(--white, #fff); }
        form { display: flex; gap: 10px; }
        input { flex: 1; padding: 15px 18px; border-radius: 30px; border: 1.5px solid var(--border, #E2D9CA); font-size: 16px; outline: none; }
        input:focus { border-color: var(--green, #2A5C2E); }
        button { background: var(--green, #2A5C2E); color: #fff; border: none; border-radius: 30px; padding: 0 24px; font-size: 16px; font-weight: 700; cursor: pointer; }
        button:disabled { opacity: .6; cursor: default; }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
        .chip { background: var(--green-pale, #EDF4EE); color: var(--green, #2A5C2E); border: 1px solid #D4E6D5; border-radius: 20px; padding: 9px 14px; font-size: 13.5px; font-weight: 600; cursor: pointer; }
        .chip:hover { background: var(--green, #2A5C2E); color: #fff; }
        @media (max-width: 600px) { button { padding: 0 18px; } .bubble { max-width: 86%; } }
      `}</style>

      <div className="thread">
        {!started && (
          <p className="empty">👋 Hi! I'm your holistic dog-nutrition assistant. Ask me anything, or tap a question below.</p>
        )}
        {messages.map((m, i) =>
          m.role === 'user' ? (
            <div key={i} className="row user">
              <div className="bubble user">{m.content}</div>
            </div>
          ) : (
            <div key={i} className="row">
              <div className="avatar">🐾</div>
              <div className="bubble bot" dangerouslySetInnerHTML={{ __html: renderMarkdown(m.content) }} />
            </div>
          ),
        )}
        {loading && (
          <div className="row">
            <div className="avatar">🐾</div>
            <div className="typing">thinking…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="composer">
        <form onSubmit={(e) => { e.preventDefault(); send(input) }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your dog's food or health…"
            aria-label="Ask the assistant"
          />
          <button disabled={loading}>{loading ? '…' : 'Ask'}</button>
        </form>
        <div className="chips">
          {STARTERS.map((s) => (
            <button key={s} type="button" className="chip" onClick={() => send(s)} disabled={loading}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
