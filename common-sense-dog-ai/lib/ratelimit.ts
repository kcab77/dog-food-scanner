import { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Per-IP rate limiting for the AI endpoints (they call Claude = cost money).
// Protects against the abuse that burned tokens last time. Uses Upstash Redis
// so limits hold across Vercel serverless instances (in-memory would reset on
// every cold start and wouldn't actually stop an attacker).
//
// Setup: create a free Upstash Redis DB, then add to Vercel env:
//   UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
// Until those are set, this fails OPEN (allows everything) so local/dev and the
// current deploy keep working unchanged.

const configured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

// 20 requests per 60s per IP — generous for a real human, blocks bursts/bots.
const ratelimit = configured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(20, '60 s'),
      prefix: 'csd-ai',
      analytics: true,
    })
  : null

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0].trim()
  return req.headers.get('x-real-ip') || '127.0.0.1'
}

// Returns true if the request is allowed, false if it's over the limit.
// Fails OPEN on any error or when not configured — never blocks real users
// because of an infra hiccup.
export async function isAllowed(req: NextRequest): Promise<boolean> {
  if (!ratelimit) return true
  try {
    const { success } = await ratelimit.limit(getClientIp(req))
    return success
  } catch {
    return true
  }
}
