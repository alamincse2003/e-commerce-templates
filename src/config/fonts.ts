import {
  Albert_Sans,
  Anek_Bangla,
  Anton,
  Bodoni_Moda,
  Familjen_Grotesk,
  Gilda_Display,
  Hanken_Grotesk,
  Jost,
  Marcellus,
  Tenor_Sans,
  Tiro_Bangla,
  UnifrakturMaguntia,
} from "next/font/google";

/**
 * All theme fonts are self-hosted by next/font and exposed as CSS variables.
 * Only the default client's faces are preloaded; the rest download on demand when a theme uses them.
 * Bengali faces load only when Bangla glyphs appear on the page (unicode-range).
 * (next/font options must be literals, so preload flags are set by hand.)
 */
const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken", display: "swap", preload: true });
const bodoni = Bodoni_Moda({ subsets: ["latin"], variable: "--font-bodoni", display: "swap", preload: true });
const albert = Albert_Sans({ subsets: ["latin"], variable: "--font-albert", display: "swap", preload: false });
const tenor = Tenor_Sans({ subsets: ["latin"], weight: "400", variable: "--font-tenor", display: "swap", preload: false });
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton", display: "swap", preload: false });
const familjen = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-familjen", display: "swap", preload: false });
const unifraktur = UnifrakturMaguntia({ subsets: ["latin"], weight: "400", variable: "--font-unifraktur", display: "swap", preload: false });
const gilda = Gilda_Display({ subsets: ["latin"], weight: "400", variable: "--font-gilda", display: "swap", preload: false });
const jost = Jost({ subsets: ["latin"], variable: "--font-jost", display: "swap", preload: false });
const marcellus = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-marcellus", display: "swap", preload: false });
const bnSans = Anek_Bangla({ subsets: ["bengali"], variable: "--font-bn-sans", display: "swap", preload: false });
const bnSerif = Tiro_Bangla({ subsets: ["bengali"], weight: "400", variable: "--font-bn-serif", display: "swap", preload: false });

export const fontVariables = [hanken, bodoni, albert, tenor, anton, familjen, unifraktur, gilda, jost, marcellus, bnSans, bnSerif]
  .map((f) => f.variable)
  .join(" ");
