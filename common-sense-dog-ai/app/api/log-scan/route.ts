import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json({ ok: false }, { status: 403 })
  try {
    const body = await req.json()
    const scriptUrl = process.env.SHEET_SCRIPT_URL
    if (!scriptUrl) return NextResponse.json({ ok: true })

    await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(body),
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
