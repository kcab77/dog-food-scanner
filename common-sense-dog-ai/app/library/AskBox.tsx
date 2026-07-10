'use client'

import { useState } from 'react'
import { renderMarkdown } from '@/lib/markdown'

// Live "ask the assistant" box shown on each topic page. Posts to the same
// /api/chat endpoint the main chat uses (Pinecone-backed, same-origin).
export default function AskBox({ topic }: { topic: string }) {
  const [q, setQ] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function ask(e: React.FormEvent) {
    e.preventDefault()
    const question = q.trim()
    if (!question || loading) return
    setLoading(true)
    setAnswer('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Regarding "${topic}": ${question}` }],
        }),
      })
      const data = await res.json()
      setAnswer(data.message || data.error || "Sorry, I couldn't answer that right now.")
    } catch {
      setAnswer("Sorry, I couldn't connect right now — please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="askbox">
      <style jsx>{`
        .askbox { background: var(--green-pale, #EDF4EE); border: 1px solid #C8DFC9; border-radius: 18px; padding: 24px; margin: 44px 0 8px; }
        h3 { font-size: 18px; font-weight: 700; color: var(--green, #2A5C2E); margin: 0 0 14px; }
        form { display: flex; gap: 10px; }
        input { flex: 1; padding: 13px 16px; border-radius: 12px; border: 1.5px solid #C8DFC9; font-size: 15px; outline: none; background: #fff; }
        input:focus { border-color: var(--green, #2A5C2E); }
        button { background: var(--green, #2A5C2E); color: #fff; border: none; border-radius: 12px; padding: 0 22px; font-weight: 700; font-size: 15px; cursor: pointer; }
        button:disabled { opacity: 0.6; cursor: default; }
        .answer { margin-top: 16px; background: #fff; border-radius: 12px; padding: 16px 18px; font-size: 15px; line-height: 1.7; color: #333; }
        .answer :global(h1), .answer :global(h2) { font-size: 17px; font-weight: 700; margin: 16px 0 6px; color: var(--green, #2A5C2E); }
        .answer :global(h3) { font-size: 15px; font-weight: 700; margin: 12px 0 4px; }
        .answer :global(p) { margin: 0 0 10px; }
        .answer :global(ul), .answer :global(ol) { margin: 0 0 10px 18px; }
        .answer :global(li) { margin-bottom: 5px; }
        .answer :global(strong) { color: #111; font-weight: 700; }
        .answer :global(a) { color: var(--green, #2A5C2E); text-decoration: underline; }
        .answer :global(em) { color: #888; font-size: 13px; }
        .answer :global(> :first-child) { margin-top: 0; }
        .answer :global(> :last-child) { margin-bottom: 0; }
        @media (max-width: 600px) { form { flex-direction: column; } button { padding: 13px; } }
      `}</style>
      <h3>💬 Still have a question about this?</h3>
      <form onSubmit={ask}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask the assistant…"
          aria-label="Ask a question"
        />
        <button disabled={loading}>{loading ? 'Thinking…' : 'Ask'}</button>
      </form>
      {answer && (
        <div className="answer" dangerouslySetInnerHTML={{ __html: renderMarkdown(answer) }} />
      )}
    </div>
  )
}
