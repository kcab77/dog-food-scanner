import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ask the Assistant',
  description: 'An AI assistant that answers in an expert’s own voice, from their own published work.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
