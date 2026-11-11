import type { FontKey } from "@/config/fonts.meta";
import type { Theme } from "@/config/schema/theme";
import { isLight, mixHex, readableOn } from "@/lib/color";

export type ColorOverrideKey = "primary" | "secondary" | "accent" | "background" | "foreground";
export type FontOverrideKey = "display" | "heading" | "body";

export type ThemeOverridesInput = {
  colors: Partial<Record<ColorOverrideKey, string>>;
  fonts: Partial<Record<FontOverrideKey, FontKey>>;
};

/**
 * Applies the handful of high-level overrides exposed in the preview panel and derives the
 * dependent tokens (foregrounds, surfaces, borders) so a single color pick stays coherent.
 */
export function applyThemeOverrides(theme: Theme, { colors, fonts }: ThemeOverridesInput): Theme {
  const c = { ...theme.colors };

  if (colors.background || colors.foreground) {
    const bg = colors.background ?? c.background;
    const fg = colors.foreground ?? c.foreground;
    c.background = bg;
    c.foreground = fg;
    c.card = mixHex(bg, fg, 0.02);
    c.cardForeground = fg;
    c.surface = mixHex(bg, fg, 0.05);
    c.muted = mixHex(bg, fg, 0.07);
    c.mutedForeground = mixHex(fg, bg, 0.42);
    c.border = mixHex(bg, fg, 0.16);
  }
  if (colors.primary) {
    c.primary = colors.primary;
    c.primaryForeground = readableOn(colors.primary, c.background, c.foreground);
    c.button = colors.primary;
    c.buttonForeground = c.primaryForeground;
  }
  if (colors.secondary) {
    c.secondary = colors.secondary;
    c.secondaryForeground = readableOn(colors.secondary, c.background, c.foreground);
  }
  if (colors.accent) {
    c.accent = colors.accent;
    c.accentForeground = readableOn(colors.accent);
  }

  return {
    ...theme,
    colors: c,
    effects: colors.background
      ? { ...theme.effects, imageBlend: isLight(c.background) ? "multiply" : "normal" }
      : theme.effects,
    typography: {
      ...theme.typography,
      display: fonts.display ?? theme.typography.display,
      heading: fonts.heading ?? theme.typography.heading,
      body: fonts.body ?? theme.typography.body,
    },
  };
}
