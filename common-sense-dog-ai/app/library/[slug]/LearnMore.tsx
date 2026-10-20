import Link from 'next/link'
import { partnersForTopic, AFFILIATE_DISCLOSURE } from '@/lib/partners'
import type { LibraryTopic } from '@/lib/library-data'

/**
 * The bottom of a topic page: what to buy, and what to read next.
 *
 * Two jobs that health sites usually do badly in opposite directions. They
 * either bolt a product grid on with no relationship to the article, or they
 * end with three unrelated "related posts" and the reader leaves. This keeps
 * the product tied to the specific gap the article just described, and turns
 * the related links into an ordered path so there is always an obvious next
 * click.
 */
export default function LearnMore({
  topic,
  path,
  pathLabel,
}: {
  topic: LibraryTopic
  path: LibraryTopic[]
  pathLabel: string
}) {
  const picks = partnersForTopic(topic.slug, topic.tag)

  return (
    <>
      {picks.length > 0 && (
        <section className="picks">
          <div className="picks-head">
            <span className="picks-kicker">What I actually use</span>
            <h2>For {topic.title.toLowerCase()}</h2>
            <p className="picks-sub">
              Narrow on purpose — only what this page argues for. Kyle feeds these to Hershey.
            </p>
          </div>

          <div className="pick-grid">
            {picks.map((p) => (
              <div key={p.id} className="pick">
                <span className="pick-bubble" aria-hidden="true">{p.emoji}</span>
                <div className="pick-body">
                  <h3>{p.name}</h3>
                  <p className="pick-blurb">{p.blurb}</p>
                  {p.howToUse && (
                    <p className="pick-how">
                      <strong>How to use it:</strong> {p.howToUse}
                    </p>
                  )}
                  <a
                    className="pick-cta"
                    href={p.url}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                  >
                    View on Amazon <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="disclose">{AFFILIATE_DISCLOSURE}</p>
        </section>
      )}

      {path.length > 0 && (
        <section className="pathway">
          <div className="picks-head">
            <span className="picks-kicker">Keep going</span>
            <h2>{pathLabel}</h2>
          </div>
          <ol className="path-list">
            {path.map((t, i) => (
              <li key={t.slug}>
                <Link href={`/library/${t.slug}`} className="path-item">
                  <span className="path-num" aria-hidden="true">{i + 1}</span>
                  <span className="path-text">
                    <span className="path-title">
                      <span className="path-emoji" aria-hidden="true">{t.emoji}</span>
                      {t.title}
                    </span>
                    <span className="path-summary">{t.summary}</span>
                  </span>
                  <span className="path-arrow" aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ol>
          <Link href="/library" className="path-all">
            Browse all 44 topics, A–Z <span aria-hidden="true">→</span>
          </Link>
        </section>
      )}
    </>
  )
}
