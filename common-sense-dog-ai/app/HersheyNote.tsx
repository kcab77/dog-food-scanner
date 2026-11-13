import type { HersheyNote as Note } from '@/lib/hershey'

/**
 * The Hershey note — first thing on a topic page, above the article.
 *
 * It sits above the general advice on purpose. Everything below it is true of
 * dogs; this is true of one dog, with a name and an age, and that is the part
 * no other dog-health page on the internet has. Reading order follows the way
 * someone tells you this in person: here's what I do → here's what happened
 * when it got bad → here's how it turned out.
 *
 * Deliberately NOT styled like the affiliate "picks" block further down. That
 * one is saturated because it wants a click. This one wants to be believed, so
 * it reads like a note in the margin: one rule down the left, no button, no
 * gradient, body text at article size rather than caption size.
 */
export default function HersheyNote({ note }: { note: Note | null }) {
  if (!note) return null

  return (
    <>
      <style>{`
        .hn {
          position: relative;
          border-left: 3px solid var(--leaf-bright);
          background: var(--leaf-tint);
          border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
          padding: 20px 22px 18px;
          margin: 0 0 34px;
        }
        .hn-kicker {
          display: inline-flex; align-items: center; gap: 7px;
          font-size: 11px; font-weight: 800; letter-spacing: 1.3px;
          text-transform: uppercase; color: var(--leaf);
          margin: 0 0 9px;
        }
        .hn-kicker b { font-weight: 800; }
        .hn h2 {
          font-family: var(--display); font-size: 21px; line-height: 1.25;
          margin: 0 0 11px; color: var(--text); font-weight: 700;
        }
        .hn p { font-size: 15.5px; line-height: 1.75; color: var(--text); margin: 0 0 13px; }
        .hn p:last-of-type { margin-bottom: 0; }
        .hn-worse {
          border-top: 1px solid var(--border-soft);
          padding-top: 13px; margin-top: 2px;
        }
        .hn-worse span {
          display: block; font-size: 11.5px; font-weight: 800; letter-spacing: .9px;
          text-transform: uppercase; color: var(--text-faint); margin-bottom: 6px;
        }
        .hn-outcome {
          font-size: 15.5px; line-height: 1.7; color: var(--text);
          font-weight: 600; margin: 13px 0 0;
          padding-left: 13px; border-left: 2px solid var(--amber);
        }
        .hn-who {
          font-size: 12px; color: var(--text-faint); line-height: 1.6;
          margin: 15px 0 0; padding-top: 12px;
          border-top: 1px solid var(--border-soft);
        }
        @media (max-width: 600px) { .hn { padding: 17px 17px 15px; } .hn h2 { font-size: 19px; } }
      `}</style>

      <aside className="hn">
        <p className="hn-kicker"><span aria-hidden="true">🐕</span> <b>From my own dog</b></p>
        <h2>{note.heading}</h2>

        <p>{note.routine}</p>

        {note.worseCase && (
          <div className="hn-worse">
            <span>When it got worse</span>
            <p>{note.worseCase}</p>
          </div>
        )}

        {note.outcome && <p className="hn-outcome">{note.outcome}</p>}

        <p className="hn-who">
          Hershey — 8 years old, 75 lb Labrador mix, Massachusetts. One dog, not a study.
        </p>
      </aside>
    </>
  )
}
