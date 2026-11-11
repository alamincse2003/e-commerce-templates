/**
 * Font registry metadata. Safe to import from client components (no next/font calls here).
 *
 * Every Latin face is paired with a Bengali fallback of the same "kind", so Bangla copy
 * (product names, taglines, festival campaigns) renders in a matching style on any theme.
 *
 * To add a font: load it in `fonts.ts` with a matching `variable`, then register it below.
 */
export const FONT_KEYS = [
  "hanken",
  "bodoni",
  "albert",
  "tenor",
  "anton",
  "familjen",
  "unifraktur",
  "gilda",
  "jost",
  "marcellus",
] as const;

export type FontKey = (typeof FONT_KEYS)[number];
type Kind = "sans" | "serif";

export const FONT_META: Record<FontKey, { label: string; cssVar: string; kind: Kind; fallback: string }> = {
  hanken: { label: "Hanken Grotesk", cssVar: "--font-hanken", kind: "sans", fallback: "'Helvetica Neue', Arial, sans-serif" },
  bodoni: { label: "Bodoni Moda", cssVar: "--font-bodoni", kind: "serif", fallback: "Didot, 'Times New Roman', serif" },
  albert: { label: "Albert Sans", cssVar: "--font-albert", kind: "sans", fallback: "'Helvetica Neue', Arial, sans-serif" },
  tenor: { label: "Tenor Sans", cssVar: "--font-tenor", kind: "sans", fallback: "'Gill Sans', sans-serif" },
  anton: { label: "Anton", cssVar: "--font-anton", kind: "sans", fallback: "Impact, 'Arial Narrow', sans-serif" },
  familjen: { label: "Familjen Grotesk", cssVar: "--font-familjen", kind: "sans", fallback: "'Helvetica Neue', Arial, sans-serif" },
  unifraktur: { label: "UnifrakturMaguntia", cssVar: "--font-unifraktur", kind: "serif", fallback: "'Old English Text MT', serif" },
  gilda: { label: "Gilda Display", cssVar: "--font-gilda", kind: "serif", fallback: "Georgia, serif" },
  jost: { label: "Jost", cssVar: "--font-jost", kind: "sans", fallback: "Futura, 'Century Gothic', sans-serif" },
  marcellus: { label: "Marcellus", cssVar: "--font-marcellus", kind: "serif", fallback: "'Trajan Pro', Georgia, serif" },
};

const BENGALI: Record<Kind, string> = {
  sans: "var(--font-bn-sans)",
  serif: "var(--font-bn-serif)",
};

/** CSS font-family stack: Latin face → matching Bengali face → system fallback. */
export const fontStack = (key: FontKey) => {
  const f = FONT_META[key];
  return `var(${f.cssVar}), ${BENGALI[f.kind]}, ${f.fallback}`;
};
