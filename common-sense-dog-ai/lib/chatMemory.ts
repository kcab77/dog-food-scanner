import { createClient } from '@supabase/supabase-js'
import type { NextRequest } from 'next/server'

/**
 * Cross-session memory for the coach.
 *
 * `chat_messages` has existed since 2026-07-22 and nothing has ever written to
 * it, so every conversation started from zero — the assistant could not know
 * you told it about the lipomas last week. That is the single thing that makes
 * a grounded assistant still feel generic: restating your dog's history every
 * session is exactly the ChatGPT experience we are trying not to be.
 *
 * Same security posture as dogProfile.ts: the token is verified server-side and
 * the client is scoped to it, so RLS enforces "own rows only". The client never
 * says who it is. Anonymous callers get no memory and must keep working — app
 * versions already on the App Store send no token at all.
 */

const SUPABASE_URL = process.env.APP_SUPABASE_URL || 'https://dyzupdctgejwyuocqbtw.supabase.co'

export type StoredMessage = { role: 'user' | 'assistant'; content: string }

function clientFor(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  if (!token) return null
  const anonKey = process.env.APP_SUPABASE_ANON_KEY
  if (!anonKey) return null
  return createClient(SUPABASE_URL, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Earlier exchanges from this user, oldest first.
 *
 * Capped deliberately. History is resent on every request and billed every
 * time, so an uncapped transcript turns a cheap question into an expensive one
 * and eventually overflows the window. Ten messages is roughly five exchanges —
 * enough to remember the dog and the thread, not enough to be the whole prompt.
 */
export async function loadHistory(req: NextRequest, limit = 10): Promise<StoredMessage[]> {
  const sb = clientFor(req)
  if (!sb) return []
  try {
    const { data: userData } = await sb.auth.getUser()
    if (!userData?.user) return []
    const { data } = await sb
      .from('chat_messages')
      .select('role, content')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (!data?.length) return []
    return (data as StoredMessage[]).reverse()
  } catch {
    return [] // memory is an enhancement; never let it break the answer
  }
}

/**
 * Persist one exchange. Fire-and-forget by design — a failed write must never
 * cost the user the reply they already waited for.
 */
export async function saveExchange(
  req: NextRequest,
  userText: string,
  assistantText: string,
  source: 'app' | 'website' = 'app',
): Promise<void> {
  const sb = clientFor(req)
  if (!sb) return
  try {
    const { data: userData } = await sb.auth.getUser()
    const uid = userData?.user?.id
    if (!uid) return
    // The column caps content at 8000 chars; truncate rather than lose the row.
    const trim = (s: string) => (s || '').slice(0, 7900)
    await sb.from('chat_messages').insert([
      { user_id: uid, role: 'user', content: trim(userText), source },
      { user_id: uid, role: 'assistant', content: trim(assistantText), source },
    ])
  } catch {
    /* ignore */
  }
}

/**
 * True when the client is starting fresh rather than continuing a thread it is
 * already holding. Only then is stored history worth prepending — otherwise the
 * same turns would appear twice, once from the client and once from the table.
 */
export function isNewConversation(messages: { role: string }[]): boolean {
  return (messages?.length ?? 0) <= 1
}
