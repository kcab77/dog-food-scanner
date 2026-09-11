'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * One nav, used by every page.
 *
 * Six pages each carried their own copy of this markup, which is how the links
 * drifted — /foods had none at all. It also marks the current page with
 * aria-current, which the copies never did, so nobody could tell where they
 * were.
 */
const LINKS = [
  { href: '/foods', label: 'Food scores' },
  { href: '/library', label: 'Health A–Z' },
  { href: '/answers', label: 'Directory' },
  { href: '/recommended', label: 'Picks' },
  { href: '/blog', label: 'Articles' },
]

const APP_URL = 'https://apps.apple.com/app/id6760376540'

export default function Nav() {
  const path = usePathname() || '/'
  return (
    <nav className="nav">
      <div className="nav-in">
        <Link href="/" className="nav-brand">
          <b>🐾 Common Sense Dog</b>
          <span>Holistic dog nutrition</span>
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={path === l.href || path.startsWith(l.href + '/') ? 'page' : undefined}
            >
              {l.label}
            </Link>
          ))}
          <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="nav-cta">
            Get the app
          </a>
        </div>
      </div>
    </nav>
  )
}
