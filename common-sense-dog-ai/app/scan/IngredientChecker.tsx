'use client'

import { useState } from 'react'
import { renderMarkdown } from '@/lib/markdown'

export default function IngredientChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function analyze(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || loading) return
    setLoading(true)
    setResult('')
    setError('')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: text }),
      })
      const data = await res.json()
      if (data.message) setResult(data.message)
      else setError(data.error || 'Something went wrong — please try again.')
    } catch {
      setError("Couldn't connect — please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checker">
      <style jsx>{`
        .checker { max-width: 680px; margin: 0 auto; }
        form { display: flex; flex-direction: column; gap: 12px; }
        textarea { width: 100%; min-height: 130px; padding: 16px; border-radius: 14px; border: 1.5px solid var(--border, #E2D9CA); font-size: 15px; line-height: 1.6; resize: vertical; outline: none; background: #fff; font-family: inherit; }
        textarea:focus { border-color: var(--green, #2A5C2E); }
        button { align-self: center; background: var(--green, #2A5C2E); color: #fff; border: none; border-radius: 30px; padding: 14px 36px; font-size: 16px; font-weight: 700; cursor: pointer; transition: background .15s; }
        button:hover:not(:disabled) { background: #3D7A42; }
        button:disabled { opacity: 0.6; cursor: default; }
        .hint { text-align: center; font-size: 13px; color: var(--text-muted, #7A746B); margin-top: -2px; }
        .error { margin-top: 16px; background: #FDECEC; border: 1px solid #F3C2C2; color: #9B2C2C; border-radius: 12px; padding: 14px 16px; font-size: 14px; }
        .result { margin-top: 22px; background: #fff; border: 1px solid var(--border, #E2D9CA); border-radius: 16px; padding: 22px 24px; font-size: 15px; line-height: 1.7; color: #333; box-shadow: 0 6px 20px rgba(42,92,46,.06); }
        .result :global(h2) { font-size: 19px; font-weight: 800; margin: 0 0 14px; color: var(--green, #2A5C2E); }
        .result :global(p) { margin: 0 0 10px; }
        .result :global(strong) { color: #111; font-weight: 700; }
        .result :global(ul) { margin: 4px 0 16px 18px; }
        .result :global(li) { margin-bottom: 6px; }
        .result :global(a) { color: var(--green, #2A5C2E); text-decoration: underline; }
        .result :global(em) { color: #888; font-size: 13px; }
        .result :global(> :first-child) { margin-top: 0; }
        .result :global(> :last-child) { margin-bottom: 0; }
        .cta { margin-top: 16px; background: var(--green-pale, #EDF4EE); border: 1px solid #D4E6D5; border-radius: 14px; padding: 16px 20px; text-align: center; }
        .cta p { margin: 0 0 10px; font-size: 14px; color: #2B2A26; line-height: 1.55; }
        .cta a { display: inline-block; background: var(--green, #2A5C2E); color: #fff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 10px 20px; border-radius: 22px; }
        .cta a:hover { background: #21471f; }
      `}</style>

      <form onSubmit={analyze}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the ingredient list here — e.g. Chicken, Brown Rice, Chicken Meal, Corn, BHA, Menadione Sodium Bisulfite…"
          aria-label="Ingredient list"
        />
        <button disabled={loading}>{loading ? 'Checking…' : '🔍 Check these ingredients'}</button>
        <p className="hint">Free · holistic · no app needed</p>
      </form>

      {error && <div className="error">{error}</div>}
      {result && (
        <>
          <div className="result" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) }} />
          <div className="cta">
            <p>Want to upgrade the bowl? See the holistic supplements &amp; whole-food add-ons we actually recommend.</p>
            <a href="/recommended">🌿 See Trusted Picks →</a>
          </div>
        </>
      )}
    </div>
  )
}
