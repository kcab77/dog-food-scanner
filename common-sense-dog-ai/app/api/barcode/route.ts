import { NextRequest, NextResponse } from 'next/server'
import { isValidAppRequest } from '@/lib/auth'
import { isAllowed } from '@/lib/ratelimit'

export async function GET(req: NextRequest) {
  if (!isValidAppRequest(req)) return NextResponse.json(null, { status: 403 })
  if (!(await isAllowed(req))) return NextResponse.json(null, { status: 429 })
  const barcode = req.nextUrl.searchParams.get('code')
  if (!barcode) return NextResponse.json(null, { status: 400 })

  try {
    const response = await fetch(`https://go-upc.com/api/v1/code/${barcode}`, {
      headers: { 'Authorization': `Bearer ${process.env.GOUPC_KEY}` }
    })
    if (!response.ok) return NextResponse.json(null, { status: response.status })
    return NextResponse.json(await response.json())
  } catch (e) {
    return NextResponse.json(null, { status: 500 })
  }
}
