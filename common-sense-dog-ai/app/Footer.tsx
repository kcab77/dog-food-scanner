import Link from 'next/link'

/**
 * One footer, used by every page — and the home of the legal disclaimer.
 *
 * ⚠️ The two clauses doing the real work are "does not diagnose, treat, cure or
 * prevent" and "creates no veterinarian-client-patient relationship". They look
 * like padding and they are not. Don't trim them.
 */
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-in">
        <div className="footer-links">
          <Link href="/foods">Food scores</Link>
          <Link href="/library">Health A–Z</Link>
          <Link href="/answers">Safety directory</Link>
          <Link href="/recommended">Trusted picks</Link>
          <Link href="/blog">Articles</Link>
          <Link href="/scan">Ingredient checker</Link>
        </div>
        <p className="footer-legal">
          <strong>For informational and educational purposes only.</strong> Common Sense Dog does
          not diagnose, treat, cure or prevent any disease or condition, and nothing here is
          veterinary advice or creates a veterinarian-client-patient relationship. Content reflects
          general and holistic pet-nutrition research and is provided as information, not as a
          treatment plan for your individual animal. Always consult a licensed veterinarian before
          changing your dog&apos;s diet or starting any supplement or protocol, and seek immediate
          veterinary care in an emergency.
        </p>
        <p className="footer-copy">© {new Date().getFullYear()} Common Sense Dog</p>
      </div>
    </footer>
  )
}
