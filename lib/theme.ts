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
// Derived from whole foods against a dark instrument ground: kale, turmeric,
// carrot, chili, blueberry. Swap these for a different mood in one pass.
const palette = {
  // grounds — deep indigo-biased ink (a *chosen* neutral, not flat grey)
  ink: '#0C0E1A',
  slate: '#151830',
  slateRaised: '#1C2043',
  slateSunken: '#12142B',
  hairline: '#282E4E',
  hairlineBright: '#333A5E',

  // type
  white: '#FFFFFF',
  paper: '#F0F2FA',
  ash: '#D6DAEA',
  smoke: '#9198BC',
  slateGrey: '#666E93',
  faint: '#4B5270',
  black: '#000000',

  // produce-derived semantics
  kale: '#35D89A',
  kaleDeep: '#1E8449',
  kaleTint: '#0D2818',

  turmeric: '#F5C542',
  turmericDeep: '#92731A',
  turmericTint: '#2D2A10',

  carrot: '#FF9A3D',
  carrotDeep: '#B4531A',
  carrotTint: '#2D1E10',

  chili: '#FF5E7E',
  chiliDeep: '#C0392B',
  chiliTint: '#3D1010',
  chiliDeepest: '#7B0000',

  berry: '#8091FF',
  berryDeep: '#3B4BC4',
  berryTint: '#161A3D',

  // supporting accents (supplement cards, misc)
  ocean: '#06B6D4',
  oceanTint: '#001A1F',
  violet: '#A78BFA',
  violetTint: '#1A0D2E',
  lime: '#A3E635',
  limeTint: '#0A1A00',
  rose: '#F43F5E',
  roseTint: '#1A0008',
  ember: '#F97316',
  emberTint: '#1A0A00',
  emerald: '#22C55E',
  emeraldTint: '#041A0A',
  sky: '#7DD3FC',
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
  onAccent: palette.ink, // text sitting ON a bright accent fill

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
