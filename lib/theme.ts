import { Appearance } from 'react-native';

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
 * LIGHT / DARK MODE (added 2026-07-19)
 *   `t` resolves to `lightTokens` or `darkTokens` based on the device's OS
 *   appearance setting (`Appearance.getColorScheme()`), read ONCE when the app
 *   launches. Both palettes use real Apple system-colour values (Apple
 *   publishes distinct light/dark variants for every system colour — this
 *   uses the actual pairs, not a naive invert).
 *
 *   Known limitation: because `t` is a single static object imported
 *   throughout the app (not a React context), it picks up the OS scheme at
 *   launch but does NOT live-update if the user flips Light/Dark mid-session
 *   while the app stays open — a relaunch picks up the change. Making it
 *   live-update requires converting every component's colour access to a
 *   theme hook/context and moving the (large) StyleSheet.create() block to
 *   recompute per-render — a genuinely separate, larger project, not a
 *   drop-in change. Flagged here rather than silently half-done.
 *
 * STRUCTURE
 *   lightPalette / darkPalette — the raw named colours per mode. The "paint".
 *   buildTokens(palette)       — maps a palette to the semantic token shape.
 *   t                          — semantic tokens for the ACTIVE mode (what a
 *                                 colour MEANS, not what it looks like).
 *                                 Components only ever use `t`, never a
 *                                 palette directly.
 *
 * Why the split: `t.critical` stays meaningful when you change it from red to
 * magenta. `palette.chili` would be a lie the moment you do.
 */

// ── LIGHT PALETTE ────────────────────────────────────────────────────────────
// Apple-inspired light theme: soft iOS system grey ground, white grouped
// cards, and the real Apple LIGHT-mode system colours. Those system colours
// are deliberately dual-purpose in Apple's own design — saturated enough to
// read as white-on-fill (buttons, pills, badges) AND dark enough to read as
// text-on-white (labels, links) — which is why they were chosen over the
// brighter dark-mode-only brights this app used to run.
const lightPalette = {
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

  // produce-derived semantics, on real Apple LIGHT system-colour values.
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

// ── DARK PALETTE ─────────────────────────────────────────────────────────────
// Same Apple system-colour family, DARK-mode variants (Apple's own published
// dark pairs — brighter/more saturated than the light-mode versions, which is
// how Apple keeps them legible against near-black rather than a naive invert).
const darkPalette = {
  // grounds — iOS systemGroupedBackground family, dark
  ink: '#000000',
  slate: '#1C1C1E',
  slateRaised: '#242426',
  slateSunken: '#0E0E0F',
  hairline: 'rgba(84,84,88,0.55)',
  hairlineBright: 'rgba(99,99,104,0.68)',

  // type — iOS dark label / secondaryLabel / tertiaryLabel family
  white: '#FFFFFF',
  paper: '#FFFFFF',
  ash: '#D1D1D6',
  smoke: '#9A9AA0',
  slateGrey: '#7C7C82',
  faint: '#57575C',
  black: '#000000',

  // produce-derived semantics, on real Apple DARK system-colour values
  kale: '#30D158',
  kaleDeep: '#25A244',
  kaleTint: '#0F2818',

  turmeric: '#FFD60A',
  turmericDeep: '#C7A600',
  turmericTint: '#2E2705',

  carrot: '#FF9F0A',
  carrotDeep: '#CC7A00',
  carrotTint: '#2E1D05',

  chili: '#FF453A',
  chiliDeep: '#D6291F',
  chiliTint: '#360D0A',
  chiliDeepest: '#7B0000',

  berry: '#5E5CE6',
  berryDeep: '#8B89F5',
  berryTint: '#1C1B3D',

  ocean: '#40C8E0',
  oceanTint: '#052A31',
  violet: '#BF5AF2',
  violetTint: '#2C1338',
  lime: '#8FD400',
  limeTint: '#1C2900',
  rose: '#FF375F',
  roseTint: '#33081A',
  ember: '#FF9F0A',
  emberTint: '#2E1D05',
  emerald: '#30D158',
  emeraldTint: '#0F2818',
  sky: '#0A84FF',
} as const;

// ── TOKEN BUILDER ────────────────────────────────────────────────────────────
// Maps either palette to the same semantic shape, so light/dark stay
// structurally identical and can never drift out of sync with each other.
function buildTokens(palette: Record<keyof typeof lightPalette, string>) {
  return {
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
    onAccent: palette.white, // text/icons sitting ON a saturated accent fill — always light in both modes
    overlayControl: palette.white, // camera-preview controls — drawn over live video, not app chrome, constant across modes
    scrimOnCamera: 'rgba(0,0,0,0.55)', // ground behind text laid over live video, so it stays legible on a bright bag. Constant across modes for the same reason as overlayControl.

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

    // DCM / heart-risk — deliberately its OWN colour, never reused for
    // severity, so it reads as a distinct evidence-linked category.
    dcm: palette.berry,
    dcmDeep: palette.berryDeep,
    dcmTint: palette.berryTint,

    // informational / links
    info: palette.berry,
    infoSoft: palette.sky,

    // AI assistant — its own semantic token so every "Ask AI" affordance reads as
    // the same one thing wherever it appears, and the whole assistant surface can
    // be re-themed by changing this single mapping. Deliberately NOT a severity
    // colour: asking a question is neutral, not a warning.
    ai: palette.violet,
    aiTint: palette.violetTint,

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
  };
}

const lightTokens = buildTokens(lightPalette);
const darkTokens = buildTokens(darkPalette);

// ── ACTIVE MODE ──────────────────────────────────────────────────────────────
// Chosen once at launch from the device's OS Light/Dark setting. See the
// "LIGHT / DARK MODE" note at the top of this file for the live-update caveat.
const scheme = Appearance.getColorScheme();
export const t = scheme === 'dark' ? darkTokens : lightTokens;

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

/**
 * The score bands. Kyle set these on 2026-09-01: 85+ Excellent, 70-84 Good.
 *
 * ⚠️ THIS IS THE ONLY PLACE THE BANDS LIVE. app/index.tsx used to keep its own
 * private copy with different thresholds (70/50/30, four bands, no "Excellent"
 * at all) and THAT was what rendered next to the score — so a food scoring 95
 * displayed as "Good", and so did one scoring 70. Three quality tiers collapsed
 * into one word at the moment the user read it.
 *
 * Found 2026-09-01 by scripts/score-check.mjs on its first run. If you need a
 * band changed, change it here and nowhere else.
 */
export function scoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  if (score >= 30) return 'Below Average';
  return 'Low Quality';
}

/** Same bands, with the emoji the results screen shows. */
export function scoreLabelEmoji(score: number): string {
  if (score >= 85) return 'Excellent ⭐';
  if (score >= 70) return 'Good 👍';
  if (score >= 50) return 'Fair ⚠️';
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
