/**
 * PawGrade Design System — THE SINGLE SOURCE OF TRUTH FOR THE APP'S LOOK.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *  ⚡️ TO REVAMP THE ENTIRE APP'S APPEARANCE, EDIT ONLY THIS FILE.
 *
 *  Every colour in the app resolves through the `t` object below. Change a
 *  value here and it propagates everywhere — no other file needs touching.
 *  Do NOT reintroduce raw hex codes into components; add a token here instead.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * STRUCTURE
 *   palette — the raw named colours. The "paint".
 *   t       — semantic tokens (what a colour MEANS, not what it looks like).
 *             Components only ever use `t`, never `palette` directly.
 *
 * Why the split: `t.critical` stays meaningful when you change it from red to
 * magenta. `palette.chili` would be a lie the moment you do.
 */

// ── PALETTE ──────────────────────────────────────────────────────────────────
// Apple-inspired light theme: soft iOS system grey ground, white grouped
// cards, and the real Apple system colours (systemGreen/Red/Orange/Indigo).
// Those system colours are deliberately dual-purpose in Apple's own design —
// saturated enough to read as white-on-fill (buttons, pills, badges) AND dark
// enough to read as text-on-white (labels, links) — which is exactly why they
// were chosen here instead of the old neon dark-mode brights.
const palette = {
  // grounds — iOS systemGroupedBackground family
  ink: '#F2F2F7',
  slate: '#FFFFFF',
  slateRaised: '#FFFFFF',
  slateSunken: '#EFEFF4',
  hairline: 'rgba(60,60,67,0.13)',
  hairlineBright: 'rgba(60,60,67,0.22)',

  // type — iOS label / secondaryLabel / tertiaryLabel family
  white: '#FFFFFF',
  paper: '#1C1C1E',
  ash: '#3A3A3C',
  smoke: '#6C6C70',
  slateGrey: '#8E8E93',
  faint: '#B4B4BB',
  black: '#000000',

  // produce-derived semantics, now on real Apple system-colour values.
  // Tints are light pastel washes (the iOS "tag" pattern: pale bg + rich text).
  kale: '#248A3D',
  kaleDeep: '#1B6B2F',
  kaleTint: '#E6F8EA',

  turmeric: '#B7791F',
  turmericDeep: '#8A5B14',
  turmericTint: '#FFF6DD',

  carrot: '#C2410C',
  carrotDeep: '#9A3412',
  carrotTint: '#FFEDDD',

  chili: '#D70015',
  chiliDeep: '#A4000F',
  chiliTint: '#FFE5E8',
  chiliDeepest: '#7B0000',

  berry: '#5856D6',
  berryDeep: '#3B3A9E',
  berryTint: '#EEEDFB',

  // supporting accents (supplement cards, misc) — same Apple system family
  ocean: '#0086A8',
  oceanTint: '#E1F6FA',
  violet: '#8E3FBF', // darkened from Apple's systemPurple for safe white-text contrast on solid CTA fills
  violetTint: '#F6ECFC',
  lime: '#4D8400',
  limeTint: '#EFF8DE',
  rose: '#D70052',
  roseTint: '#FCE7EE',
  ember: '#C2410C',
  emberTint: '#FFEDDD',
  emerald: '#248A3D',
  emeraldTint: '#E6F8EA',
  sky: '#007AFF',
} as const;

// ── SEMANTIC TOKENS ──────────────────────────────────────────────────────────
export const t = {
  // surfaces
  bg: palette.ink,
  surface: palette.slate,
  surfaceAlt: palette.slateRaised,
  surfaceSunken: palette.slateSunken,
  border: palette.hairline,
  borderBright: palette.hairlineBright,

  // type
  textStrong: palette.paper,
  text: palette.ash,
  textMuted: palette.smoke,
  textDim: palette.slateGrey,
  textFaint: palette.faint,
  onAccent: palette.white, // text/icons sitting ON a saturated accent fill (buttons, pills, banners) — always light regardless of theme
  overlayControl: palette.white, // camera-preview controls (capture ring) — drawn over live video, not app chrome, so this stays constant across themes

  // severity — the ladder the whole scanner is built on
  good: palette.kale,
  goodDeep: palette.kaleDeep,
  goodTint: palette.kaleTint,

  moderate: palette.turmeric,
  moderateDeep: palette.turmericDeep,
  moderateTint: palette.turmericTint,

  high: palette.carrot,
  highDeep: palette.carrotDeep,
  highTint: palette.carrotTint,

  critical: palette.chili,
  criticalDeep: palette.chiliDeep,
  criticalTint: palette.chiliTint,
  toxic: palette.chiliDeepest,

  // DCM / heart-risk — deliberately its OWN colour, never reused for severity,
  // so it reads as a distinct evidence-linked category rather than "more bad".
  dcm: palette.berry,
  dcmDeep: palette.berryDeep,
  dcmTint: palette.berryTint,

  // informational / links
  info: palette.berry,
  infoSoft: palette.sky,

  // accent set for the supplement + grocery cards
  accents: {
    probiotic: { fg: palette.violet, bg: palette.violetTint },
    fishOil: { fg: palette.kale, bg: palette.kaleTint },
    mussel: { fg: palette.ocean, bg: palette.oceanTint },
    heart: { fg: palette.rose, bg: palette.roseTint },
    liver: { fg: palette.ember, bg: palette.emberTint },
    detox: { fg: palette.lime, bg: palette.limeTint },
    rover: { fg: palette.emerald, bg: palette.emeraldTint },
  },
} as const;

// ── SCALE ────────────────────────────────────────────────────────────────────
export const radius = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const type = {
  // iOS rounded face carries the "inform, don't judge" tone in the letterforms.
  display: 'SF Pro Rounded',
  size: { xs: 11, sm: 12, base: 13, md: 14, lg: 17, xl: 22, score: 56 },
  weight: { regular: '500', medium: '600', bold: '700', heavy: '800' },
} as const;

// ── SCORE HELPERS ────────────────────────────────────────────────────────────
// Score colour + label live here too, so the grading language is themed in one
// place. NOTE: these are presentation only — the scoring MATH is untouched.
export function scoreColor(score: number): string {
  if (score >= 75) return t.good;
  if (score >= 55) return t.moderate;
  if (score >= 35) return t.high;
  return t.critical;
}

export function scoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Great';
  if (score >= 60) return 'Good';
  if (score >= 45) return 'Fair';
  if (score >= 30) return 'Below Average';
  return 'Low Quality';
}

// Severity name → colour. Used by ingredient pills and the concern list.
export const severityColor: Record<string, string> = {
  toxic: t.toxic,
  severe: t.critical,
  moderate: t.high,
  mild: t.moderate,
};

export default t;
