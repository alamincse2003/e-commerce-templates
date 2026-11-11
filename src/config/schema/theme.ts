import { z } from "zod";
import { FONT_KEYS } from "../fonts.meta";

export const hexColor = z.string().regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/, "Expected a hex color such as #1a1a1a");

export const themeColorsSchema = z.object({
  background: hexColor,
  foreground: hexColor,
  surface: hexColor,
  card: hexColor,
  cardForeground: hexColor,
  primary: hexColor,
  primaryForeground: hexColor,
  secondary: hexColor,
  secondaryForeground: hexColor,
  accent: hexColor,
  accentForeground: hexColor,
  muted: hexColor,
  mutedForeground: hexColor,
  border: hexColor,
  button: hexColor,
  buttonForeground: hexColor,
  /** Contrasting "inverse" surface used by dark/feature sections (e.g. the clothing rail). */
  inverse: hexColor,
  inverseForeground: hexColor,
});

const fontKey = z.enum(FONT_KEYS);
const textCase = z.enum(["uppercase", "none"]);

export const typographySchema = z.object({
  display: fontKey,
  heading: fontKey,
  body: fontKey,
  logo: fontKey,
  weights: z.object({ display: z.number(), heading: z.number(), body: z.number() }),
  letterSpacing: z.object({ display: z.string(), heading: z.string(), body: z.string(), caps: z.string() }),
  lineHeight: z.object({ display: z.number(), heading: z.number(), body: z.number() }),
  displayCase: textCase,
  headingCase: textCase,
});

export const layoutSchema = z.object({
  containerWidth: z.string(),
  sectionSpacing: z.string(),
  radius: z.string(),
  buttonRadius: z.string(),
  cardRadius: z.string(),
  gridGap: z.string(),
  headerHeight: z.string(),
});

export const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  colors: themeColorsSchema,
  typography: typographySchema,
  layout: layoutSchema,
  effects: z.object({
    shadow: z.string(),
    grain: z.boolean(),
    /** How studio photos blend into the page. "multiply" makes light backdrops melt away on light themes. */
    imageBlend: z.enum(["multiply", "normal"]),
    /** Frosted-glass surfaces for UI floating over photography (header, fitting room, hotspots). */
    glass: z.boolean(),
  }),
});

export type Theme = z.infer<typeof themeSchema>;
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type ThemeTypography = z.infer<typeof typographySchema>;

export type ThemeOverrides = {
  id?: string;
  name?: string;
  description?: string;
  colors?: Partial<ThemeColors>;
  typography?: Partial<Omit<ThemeTypography, "weights" | "letterSpacing" | "lineHeight">> & {
    weights?: Partial<ThemeTypography["weights"]>;
    letterSpacing?: Partial<ThemeTypography["letterSpacing"]>;
    lineHeight?: Partial<ThemeTypography["lineHeight"]>;
  };
  layout?: Partial<Theme["layout"]>;
  effects?: Partial<Theme["effects"]>;
};

/** Build a client theme from a preset plus partial overrides. */
export function createTheme(base: Theme, o: ThemeOverrides = {}): Theme {
  return themeSchema.parse({
    ...base,
    id: o.id ?? base.id,
    name: o.name ?? base.name,
    description: o.description ?? base.description,
    colors: { ...base.colors, ...o.colors },
    typography: {
      ...base.typography,
      ...o.typography,
      weights: { ...base.typography.weights, ...o.typography?.weights },
      letterSpacing: { ...base.typography.letterSpacing, ...o.typography?.letterSpacing },
      lineHeight: { ...base.typography.lineHeight, ...o.typography?.lineHeight },
    },
    layout: { ...base.layout, ...o.layout },
    effects: { ...base.effects, ...o.effects },
  });
}
