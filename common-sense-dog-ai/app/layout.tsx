import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

/**
 * Two real typefaces, self-hosted by next/font — no external request, no
 * layout shift, no CSP issue.
 *
 * Deliberately NOT Georgia (the previous display face) and deliberately not
 * Inter or Space Grotesk. Those are the faces every generated site lands on,
 * and the old cream-plus-Georgia combination was squarely in that territory.
 *
 * Bricolage Grotesque has genuine character at display sizes — slightly
 * condensed, a bit editorial, confident rather than corporate. Instrument Sans
 * underneath it is quiet and highly legible at body sizes.
 */
const display = Bricolage_Grotesque({
  subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['600', '700', '800'],
})
const body = Instrument_Sans({
  subsets: ['latin'], variable: '--font-body', display: 'swap',
})
import Nav from './Nav'
import Footer from './Footer'
import './globals.css'

const BASE = 'https://commonsensedog.com'
const TITLE = 'Common Sense Dog — Ask the Holistic Dog Nutrition Assistant'
const DESC =
  'Stop searching. Just ask. A holistic dog nutrition AI assistant built from years of research — get honest answers on food, ingredients, supplements, and health instead of digging through articles.'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: TITLE,
  description: DESC,
  applicationName: 'Common Sense Dog',
  keywords: [
    'holistic dog nutrition',
    'dog food ingredients',
    'is grain free safe',
    'dog food checker',
    'best dog food',
    'dog supplements',
    'holistic vet advice',
  ],
  alternates: { canonical: BASE },
  verification: { google: 'Ekjt05OYu1JsiVxnQ1RNO6EoNWp0n5iam3dJCwgCI60' },
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><text y='32' font-size='32'>🐾</text></svg>" },
  openGraph: {
    type: 'website',
    siteName: 'Common Sense Dog',
    url: BASE,
    title: TITLE,
    description: DESC,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
  },
  robots: { index: true, follow: true },
}

const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Common Sense Dog',
  url: BASE,
  description: 'Holistic dog nutrition and health — an AI assistant, ingredient checker, and research library.',
}

const websiteLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Common Sense Dog',
  url: BASE,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/library?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }} />
        <Analytics />
      </body>
    </html>
  )
}
