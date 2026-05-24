import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Life With Hershey — Real Dog Health, Real Stories',
  description: 'A dog owner\'s honest journey from trusting pet food labels to understanding every ingredient — and building an app to help you do the same.',
}

export default function Home() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --cream: #FDFAF5; --cream-dark: #F5EFE4; --green: #2A5C2E; --green-light: #3D7A42;
          --green-pale: #EDF4EE; --amber: #C97B2A; --amber-light: #F5E6CC;
          --text: #1A1A1A; --text-muted: #6B6B6B; --border: #E2D9CA; --white: #FFFFFF;
        }
        html { scroll-behavior: smooth; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--cream); color: var(--text); line-height: 1.6; }
        nav { background: var(--white); border-bottom: 1px solid var(--border); padding: 0 24px; position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .nav-logo-text { font-size: 17px; font-weight: 700; color: var(--green); letter-spacing: -0.3px; }
        .nav-logo-sub { font-size: 11px; color: var(--text-muted); }
        .nav-links { display: flex; align-items: center; gap: 28px; }
        .nav-links a { text-decoration: none; color: var(--text-muted); font-size: 14px; font-weight: 500; transition: color 0.2s; }
        .nav-links a:hover { color: var(--green); }
        .nav-cta { background: var(--green) !important; color: white !important; padding: 8px 18px; border-radius: 20px; font-size: 13px !important; font-weight: 600 !important; }
        .hero { background: linear-gradient(135deg, #2A5C2E 0%, #1E4422 50%, #162E18 100%); padding: 80px 24px 100px; text-align: center; }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #A8D5AB; font-size: 13px; font-weight: 500; padding: 6px 16px; border-radius: 20px; margin-bottom: 28px; }
        .hero h1 { font-family: Georgia, serif; font-size: clamp(36px, 6vw, 64px); font-weight: 700; color: #fff; line-height: 1.15; letter-spacing: -1px; margin-bottom: 20px; max-width: 800px; margin-left: auto; margin-right: auto; }
        .hero h1 span { color: #7DC87F; }
        .hero p { font-size: 18px; color: rgba(255,255,255,0.75); max-width: 560px; margin: 0 auto 40px; line-height: 1.7; }
        .hero-buttons { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
        .btn-primary { background: #7DC87F; color: #1A2E1B; padding: 14px 28px; border-radius: 30px; font-weight: 700; font-size: 15px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .btn-primary:hover { background: #A8D5AB; transform: translateY(-1px); }
        .btn-secondary { background: rgba(255,255,255,0.1); color: white; padding: 14px 28px; border-radius: 30px; font-weight: 600; font-size: 15px; text-decoration: none; border: 1px solid rgba(255,255,255,0.25); transition: all 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.18); }
        .hero-photo-wrap { margin-top: 56px; display: flex; justify-content: center; }
        .hero-photo { width: 200px; height: 200px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 3px solid rgba(255,255,255,0.2); display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(255,255,255,0.4); font-size: 14px; gap: 8px; }
        .intro-strip { background: var(--amber-light); border-top: 1px solid #E8D0A8; border-bottom: 1px solid #E8D0A8; padding: 28px 24px; text-align: center; }
        .intro-strip p { font-size: 17px; color: #7A4F1A; max-width: 700px; margin: 0 auto; font-style: italic; line-height: 1.7; }
        .section { padding: 80px 24px; max-width: 1100px; margin: 0 auto; }
        .section-label { font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--green); margin-bottom: 12px; }
        .section-title { font-family: Georgia, serif; font-size: clamp(28px, 4vw, 44px); font-weight: 700; color: var(--text); line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 20px; }
        .section-title span { color: var(--green); }
        .story-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .story-text p { font-size: 16px; color: #444; line-height: 1.8; margin-bottom: 18px; }
        .story-text p strong { color: var(--text); }
        .story-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
        .stat-card { background: var(--green-pale); border: 1px solid #C8DFC9; border-radius: 14px; padding: 20px; text-align: center; }
        .stat-number { font-size: 32px; font-weight: 800; color: var(--green); line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 13px; color: var(--text-muted); line-height: 1.4; }
        .story-image-placeholder { background: var(--cream-dark); border: 2px dashed var(--border); border-radius: 24px; height: 380px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); font-size: 14px; gap: 10px; }
        .timeline-section { background: var(--white); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 80px 24px; }
        .timeline-inner { max-width: 700px; margin: 0 auto; }
        .timeline-title { font-family: Georgia, serif; font-size: 36px; font-weight: 700; text-align: center; margin-bottom: 52px; color: var(--text); }
        .timeline { position: relative; }
        .timeline::before { content: ''; position: absolute; left: 20px; top: 0; bottom: 0; width: 2px; background: var(--border); }
        .timeline-item { display: flex; gap: 28px; margin-bottom: 40px; position: relative; }
        .timeline-dot { width: 42px; height: 42px; border-radius: 50%; background: var(--green); border: 3px solid var(--cream); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; position: relative; z-index: 1; }
        .timeline-content { padding-top: 6px; }
        .timeline-date { font-size: 12px; font-weight: 700; color: var(--green); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
        .timeline-content h3 { font-size: 18px; font-weight: 700; margin-bottom: 6px; }
        .timeline-content p { font-size: 15px; color: var(--text-muted); line-height: 1.6; }
        .blog-section { padding: 80px 24px; background: var(--cream-dark); }
        .blog-inner { max-width: 1100px; margin: 0 auto; }
        .blog-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
        .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .blog-card { background: var(--white); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; text-decoration: none; color: inherit; transition: all 0.2s; display: flex; flex-direction: column; }
        .blog-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); border-color: #C8DFC9; }
        .blog-card-image { background: var(--green-pale); height: 160px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
        .blog-card-body { padding: 22px; flex: 1; display: flex; flex-direction: column; }
        .blog-tag { display: inline-block; background: var(--green-pale); color: var(--green); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 20px; margin-bottom: 12px; }
        .blog-card h3 { font-size: 17px; font-weight: 700; line-height: 1.35; margin-bottom: 10px; color: var(--text); }
        .blog-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; flex: 1; }
        .blog-card-footer { padding: 14px 22px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .blog-read-more { font-size: 13px; font-weight: 600; color: var(--green); }
        .blog-date { font-size: 12px; color: var(--text-muted); }
        .view-all-link { color: var(--green); font-size: 14px; font-weight: 600; text-decoration: none; }
        .health-section { padding: 80px 24px; background: var(--white); }
        .health-inner { max-width: 1100px; margin: 0 auto; }
        .health-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; margin-top: 44px; }
        .health-card { background: var(--cream); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
        .health-card-icon { font-size: 32px; margin-bottom: 14px; }
        .health-card h3 { font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .health-card p { font-size: 14px; color: var(--text-muted); line-height: 1.6; }
        .app-section { background: linear-gradient(135deg, #1A2E1B 0%, #2A5C2E 100%); padding: 80px 24px; text-align: center; }
        .app-inner { max-width: 700px; margin: 0 auto; }
        .app-section .section-label { color: #7DC87F; }
        .app-section h2 { font-family: Georgia, serif; font-size: clamp(28px, 5vw, 44px); color: white; line-height: 1.2; margin-bottom: 18px; }
        .app-section p { font-size: 17px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 40px; }
        .app-store-btn { display: inline-flex; align-items: center; gap: 12px; background: white; color: var(--text); padding: 14px 28px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px; transition: all 0.2s; }
        .app-store-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.3); }
        .app-features { display: flex; justify-content: center; gap: 32px; margin-top: 48px; flex-wrap: wrap; }
        .app-feature { color: rgba(255,255,255,0.65); font-size: 14px; display: flex; align-items: center; gap: 7px; }
        .app-feature::before { content: '✓'; color: #7DC87F; font-weight: 700; }
        .ai-section { background: var(--green-pale); border-top: 1px solid #C8DFC9; border-bottom: 1px solid #C8DFC9; padding: 60px 24px; text-align: center; }
        .ai-inner { max-width: 600px; margin: 0 auto; }
        .ai-section h2 { font-family: Georgia, serif; font-size: 30px; color: var(--text); margin-bottom: 14px; }
        .ai-section p { font-size: 16px; color: var(--text-muted); line-height: 1.7; margin-bottom: 28px; }
        footer { background: var(--text); color: rgba(255,255,255,0.5); padding: 40px 24px; text-align: center; }
        footer p { font-size: 13px; line-height: 1.8; }
        footer a { color: rgba(255,255,255,0.7); text-decoration: none; }
        footer a:hover { color: white; }
        @media (max-width: 768px) { .story-grid { grid-template-columns: 1fr; gap: 40px; } .blog-header { flex-direction: column; align-items: flex-start; gap: 12px; } .nav-links { display: none; } }
      `}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="nav-logo">
          <span style={{fontSize:24}}>🐾</span>
          <div>
            <div className="nav-logo-text">Life With Hershey</div>
            <div className="nav-logo-sub">Real dog health from a real dog owner</div>
          </div>
        </Link>
        <div className="nav-links">
          <Link href="#story">Our Story</Link>
          <Link href="#blog">Articles</Link>
          <Link href="/chat">Ask AI</Link>
          <Link href="#pawgrade" className="nav-cta">📱 Free App</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge">🐕 Chocolate Lab · Rhode Island</div>
        <h1>How Hershey Taught Me<br/><span>Everything About Dog Health</span></h1>
        <p>A dog owner&apos;s honest journey from trusting pet food labels to understanding every ingredient — and building an app to help you do the same.</p>
        <div className="hero-buttons">
          <Link href="#story" className="btn-primary">🐾 Read Our Story</Link>
          <Link href="#blog" className="btn-secondary">Browse Articles</Link>
        </div>
        <div className="hero-photo-wrap">
          <div className="hero-photo">
            <span style={{fontSize:48}}>🐶</span>
            <div style={{fontSize:14, color:'rgba(255,255,255,0.4)'}}>Hershey&apos;s photo<br/>goes here</div>
          </div>
        </div>
      </section>

      {/* INTRO QUOTE */}
      <div className="intro-strip">
        <p>&ldquo;I spent 7 years obsessively studying holistic dog health — not because I wanted to, but because I had to. The day Hershey took Simparica and turned into a zombie, I knew something had to change. <strong>This site is everything I&apos;ve learned since.</strong>&rdquo;</p>
      </div>

      {/* OUR STORY */}
      <section className="section" id="story">
        <div className="story-grid">
          <div className="story-text">
            <div className="section-label">Our Story</div>
            <h2 className="section-title">From Kibble to <span>Whole Food</span> — Hershey&apos;s Journey</h2>
            <p>Hershey is my 75-lb chocolate Lab. He loves to swim, he&apos;s always at the softball fields or the beach — and for the first few years of his life, I thought I was doing everything right. Good vet. Regular shots. Name-brand kibble from the pet store.</p>
            <p>Then one day I gave him his <strong>Simparica</strong> pill. Within hours he was a zombie — glazed over, lethargic, not himself at all. That was the moment I started questioning everything. I dug into the ingredients, the studies, the side effects. What I found scared me. And it sent me down a path I&apos;ve never come back from.</p>
            <p>I was terrified to take him off conventional food and flea prevention. You hear horror stories. You worry you&apos;re going to make things worse. But I made the switch — off kibble, off chemical preventatives, onto <strong>gently cooked whole food with no added synthetic vitamins or minerals</strong> and a natural flea and tick protocol. The difference was immediate. More energy. Better coat. No new lipomas.</p>
            <p>That was 7 years ago. I&apos;ve spent every year since obsessively studying holistic dog health — reading studies, testing protocols, talking to holistic vets. Everything I&apos;ve learned is on this site. And the tool I built so you can check any dog food in seconds is <strong>PawGrade</strong>.</p>
            <div className="story-stats">
              <div className="stat-card">
                <div className="stat-number">7</div>
                <div className="stat-label">Years studying holistic dog health</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">70%</div>
                <div className="stat-label">Of Hershey&apos;s diet is now whole food</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">0</div>
                <div className="stat-label">New lipomas since switching to whole food</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">🐾</div>
                <div className="stat-label">More energy than ever at 7 years old</div>
              </div>
            </div>
          </div>
          <div>
            <div className="story-image-placeholder">
              <span style={{fontSize:48}}>📷</span>
              <div>Add a photo of you<br/>and Hershey here</div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section">
        <div className="timeline-inner">
          <h2 className="timeline-title">The Journey</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot">🍗</div>
              <div className="timeline-content">
                <div className="timeline-date">The Early Years</div>
                <h3>Trusting the bag</h3>
                <p>Name-brand kibble. Regular vet visits. Doing everything &ldquo;right.&rdquo; I had no reason to question any of it — Hershey seemed fine.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot">😶</div>
              <div className="timeline-content">
                <div className="timeline-date">The Wake-Up Call</div>
                <h3>Simparica turned him into a zombie</h3>
                <p>I gave him his regular Simparica pill and watched him spend the whole day glazed over and lethargic — not himself at all. I started researching. That was the beginning of everything.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot">⚠️</div>
              <div className="timeline-content">
                <div className="timeline-date">Then Came the Lipomas</div>
                <h3>Fatty lumps that shouldn&apos;t be there</h3>
                <p>His vet said they were &ldquo;common in Labs.&rdquo; I didn&apos;t accept that. I started connecting the dots between his diet, chronic inflammation, and what was growing under his skin.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot">😰</div>
              <div className="timeline-content">
                <div className="timeline-date">The Scary Part</div>
                <h3>Making the switch — terrified</h3>
                <p>Switching off kibble and off conventional flea prevention felt risky. What if I made things worse? I spent weeks reading everything before I felt confident enough to commit.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot">🥩</div>
              <div className="timeline-content">
                <div className="timeline-date">The Transition</div>
                <h3>Gently cooked whole food — no synthetic vitamins or minerals</h3>
                <p>Real ingredients. Nothing on the label I couldn&apos;t identify. Within weeks he had more energy than ever. No new lipomas. I knew I&apos;d made the right call.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot">📱</div>
              <div className="timeline-content">
                <div className="timeline-date">Today — 7 Years Later</div>
                <h3>Built PawGrade so you don&apos;t have to do this alone</h3>
                <p>Seven years of research turned into an app. Scan any dog food barcode and know instantly if it&apos;s worth feeding your dog. The research is done — you just point and scan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="blog-section" id="blog">
        <div className="blog-inner">
          <div className="blog-header">
            <div>
              <div className="section-label">Articles</div>
              <h2 className="section-title" style={{marginBottom:0}}>What I&apos;ve Learned Along the Way</h2>
            </div>
            <Link href="#" className="view-all-link">View all articles →</Link>
          </div>
          <div className="blog-grid">
            <Link href="#" className="blog-card">
              <div className="blog-card-image">🍄</div>
              <div className="blog-card-body">
                <span className="blog-tag">Supplements</span>
                <h3>Medicinal Mushrooms for Dogs: The Evidence, the Best Types, and What Actually Works</h3>
                <p>A University of Pennsylvania clinical trial. Published studies on immune modulation and cancer. Here&apos;s what the research actually says.</p>
              </div>
              <div className="blog-card-footer">
                <span className="blog-read-more">Read article →</span>
                <span className="blog-date">Deep Dive</span>
              </div>
            </Link>
            <Link href="#" className="blog-card">
              <div className="blog-card-image">🫀</div>
              <div className="blog-card-body">
                <span className="blog-tag">Nutrition</span>
                <h3>Why Omega-3s Matter More Than You Think for Dog Heart Health</h3>
                <p>Most kibble has an omega-6 to omega-3 ratio of 15:1. Dogs need closer to 5:1. Here&apos;s what chronic imbalance actually does.</p>
              </div>
              <div className="blog-card-footer">
                <span className="blog-read-more">Read article →</span>
                <span className="blog-date">Nutrition</span>
              </div>
            </Link>
            <Link href="#" className="blog-card">
              <div className="blog-card-image">🪨</div>
              <div className="blog-card-body">
                <span className="blog-tag">Conditions</span>
                <h3>Lipomas in Dogs: Why They Happen and How Diet Can Help</h3>
                <p>Vets say they&apos;re harmless. But chronic inflammation and poor diet are what cause them. Here&apos;s the full picture.</p>
              </div>
              <div className="blog-card-footer">
                <span className="blog-read-more">Read article →</span>
                <span className="blog-date">Hershey&apos;s Journey</span>
              </div>
            </Link>
            <Link href="#" className="blog-card">
              <div className="blog-card-image">🐟</div>
              <div className="blog-card-body">
                <span className="blog-tag">Supplements</span>
                <h3>Fish Oil for Dogs: Does It Actually Work, and Which Kind?</h3>
                <p>Not all fish oil is equal. The form, the source, and the dose all matter. What I give Hershey and why.</p>
              </div>
              <div className="blog-card-footer">
                <span className="blog-read-more">Read article →</span>
                <span className="blog-date">Supplements</span>
              </div>
            </Link>
            <Link href="#" className="blog-card">
              <div className="blog-card-image">🕐</div>
              <div className="blog-card-body">
                <span className="blog-tag">Health</span>
                <h3>Intermittent Fasting for Dogs: What the Research Actually Says</h3>
                <p>We&apos;ve been told dogs need to eat twice a day every day. But ancestral dogs didn&apos;t eat like that. A more nuanced take.</p>
              </div>
              <div className="blog-card-footer">
                <span className="blog-read-more">Read article →</span>
                <span className="blog-date">Lifestyle</span>
              </div>
            </Link>
            <Link href="#" className="blog-card">
              <div className="blog-card-image">🦠</div>
              <div className="blog-card-body">
                <span className="blog-tag">Gut Health</span>
                <h3>Probiotics and Digestive Enzymes: When They Help and When They Don&apos;t</h3>
                <p>The pet supplement industry sells a lot of probiotics. Here&apos;s how to know if your dog actually needs them.</p>
              </div>
              <div className="blog-card-footer">
                <span className="blog-read-more">Read article →</span>
                <span className="blog-date">Gut Health</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* HEALTH TOPICS */}
      <section className="health-section">
        <div className="health-inner">
          <div className="section-label">What We Cover</div>
          <h2 className="section-title">Everything I Wish I Knew Earlier</h2>
          <div className="health-grid">
            <div className="health-card"><div className="health-card-icon">🥩</div><h3>Whole Food Diet</h3><p>Gently cooked, freeze-dried, raw — what each means and when each makes sense for your dog.</p></div>
            <div className="health-card"><div className="health-card-icon">🏷️</div><h3>Reading Labels</h3><p>What &ldquo;by-product,&rdquo; &ldquo;natural flavors,&rdquo; and &ldquo;complete and balanced&rdquo; actually mean in practice.</p></div>
            <div className="health-card"><div className="health-card-icon">⚗️</div><h3>Flea &amp; Tick Without Chemicals</h3><p>After Simparica left Hershey lethargic and zombie-like, I built a fully natural prevention stack. Here&apos;s exactly what I use and why.</p></div>
            <div className="health-card"><div className="health-card-icon">🪨</div><h3>Lipoma Management</h3><p>Why Labs get lipomas, the inflammation connection, and the diet changes that stopped Hershey&apos;s from growing.</p></div>
            <div className="health-card"><div className="health-card-icon">💊</div><h3>Supplements That Work</h3><p>Mushrooms, fish oil, probiotics, digestive enzymes — evidence-based takes on what&apos;s worth giving.</p></div>
            <div className="health-card"><div className="health-card-icon">🦷</div><h3>Dental Health</h3><p>Natural dental care that actually works — without anesthesia cleanings every year.</p></div>
            <div className="health-card"><div className="health-card-icon">🫀</div><h3>Liver &amp; Organ Support</h3><p>Monthly heartworm preventatives work through the liver. Supporting detox pathways is something most dog owners never think about.</p></div>
            <div className="health-card"><div className="health-card-icon">🧪</div><h3>Bloodwork &amp; Monitoring</h3><p>What to actually watch on your dog&apos;s annual panel, and the cheap add-ons most vets don&apos;t mention.</p></div>
          </div>
        </div>
      </section>

      {/* AI CHAT CTA */}
      <section className="ai-section">
        <div className="ai-inner">
          <div className="section-label">Free Tool</div>
          <h2>Ask the Common Sense Dog AI</h2>
          <p>Have a question about your dog&apos;s diet, supplements, or health? Ask our AI — trained on holistic veterinary research, nutrition science, and everything I&apos;ve learned over 7 years with Hershey.</p>
          <Link href="/chat" className="btn-primary" style={{display:'inline-flex'}}>🐾 Ask a Question — Free</Link>
        </div>
      </section>

      {/* APP CTA */}
      <section className="app-section" id="pawgrade">
        <div className="app-inner">
          <div className="section-label">The App</div>
          <h2>Scan Any Dog Food.<br/>Know Exactly What&apos;s In It.</h2>
          <p>PawGrade came directly out of this journey. Scan a barcode, get an instant AI-powered breakdown of every ingredient — what it is, why it&apos;s in there, and whether it&apos;s good for your dog. Free on the App Store.</p>
          <a href="https://apps.apple.com/app/id6760376540" className="app-store-btn">
            <span style={{fontSize:28}}>🍎</span>
            <div>
              <div style={{fontSize:11, fontWeight:500, opacity:0.7}}>Download on the</div>
              <div>App Store — Free</div>
            </div>
          </a>
          <div className="app-features">
            <div className="app-feature">Scan any barcode</div>
            <div className="app-feature">AI ingredient analysis</div>
            <div className="app-feature">Processing method detection</div>
            <div className="app-feature">Ingredient-by-ingredient breakdown</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>
          <strong style={{color:'rgba(255,255,255,0.8)'}}>Life With Hershey</strong> — real dog health from a real dog owner<br/>
          <br/>
          <Link href="#story">Our Story</Link> · <Link href="#blog">Articles</Link> · <Link href="/chat">Ask AI</Link> · <Link href="#pawgrade">PawGrade App</Link><br/>
          <br/>
          Not veterinary advice. Always consult your vet for medical decisions.<br/>
          Made with 🐾 in Rhode Island
        </p>
      </footer>
    </>
  )
}
