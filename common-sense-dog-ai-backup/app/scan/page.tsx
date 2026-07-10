import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'PawGrade Scanner — Scan Any Dog Food Ingredient Label',
  description: 'Scan a dog food barcode or ingredient label and get an instant AI-powered safety score. Free to use.',
}

export default function ScanPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0D0D1A; }
        nav {
          background: #0f1020;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0 20px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-back {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: rgba(255,255,255,0.6);
          font-size: 14px;
          font-weight: 500;
          transition: color 0.2s;
        }
        .nav-back:hover { color: white; }
        .nav-title {
          font-size: 15px;
          font-weight: 700;
          color: white;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .nav-app-link {
          background: #2A5C2E;
          color: white;
          text-decoration: none;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: 20px;
          transition: background 0.2s;
        }
        .nav-app-link:hover { background: #3D7A42; }
        .scanner-wrap {
          width: 100%;
          height: calc(100dvh - 54px);
          position: relative;
        }
        iframe {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
      `}</style>

      <nav>
        <Link href="/" className="nav-back">
          ← commonsensedog.com
        </Link>
        <div className="nav-title">
          🐾 PawGrade Scanner
        </div>
        <a
          href="https://apps.apple.com/app/id6760376540"
          className="nav-app-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          🍎 Get the App
        </a>
      </nav>

      <div className="scanner-wrap">
        <iframe
          src="https://dog-food-scanner-bice.vercel.app"
          allow="camera; microphone"
          title="PawGrade Dog Food Scanner"
        />
      </div>
    </>
  )
}
