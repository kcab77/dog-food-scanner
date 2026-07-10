import { NextRequest } from 'next/server'

export function isValidAppRequest(req: NextRequest): boolean {
  return req.headers.get('x-app-secret') === process.env.APP_SECRET
}
