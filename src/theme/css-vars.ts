import { fontStack } from "@/config/fonts.meta";
import type { Theme, ThemeColors } from "@/config/schema/theme";

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

/**
 * Single source of truth for theme → CSS custom properties.
 * Every component styles itself through these `--t-*` variables (mapped to Tailwind in globals.css),
 * so swapping a theme never requires touching component code.
 */
export function themeToCssVars(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.colors) as [keyof ThemeColors, string][]) {
    vars[`--t-${kebab(key)}`] = value;
  }
  const t = theme.typography;
  vars["--t-font-display"] = fontStack(t.display);
  vars["--t-font-heading"] = fontStack(t.heading);
  vars["--t-font-body"] = fontStack(t.body);
  vars["--t-font-logo"] = fontStack(t.logo);
  vars["--t-fw-display"] = String(t.weights.display);
  vars["--t-fw-heading"] = String(t.weights.heading);
  vars["--t-fw-body"] = String(t.weights.body);
  vars["--t-tracking-display"] = t.letterSpacing.display;
  vars["--t-tracking-heading"] = t.letterSpacing.heading;
  vars["--t-tracking-body"] = t.letterSpacing.body;
  vars["--t-tracking-caps"] = t.letterSpacing.caps;
  vars["--t-leading-display"] = String(t.lineHeight.display);
  vars["--t-leading-heading"] = String(t.lineHeight.heading);
  vars["--t-leading-body"] = String(t.lineHeight.body);
  vars["--t-case-display"] = t.displayCase;
  vars["--t-case-heading"] = t.headingCase;

  const l = theme.layout;
  vars["--t-container"] = l.containerWidth;
  vars["--t-section-spacing"] = l.sectionSpacing;
  vars["--t-radius"] = l.radius;
  vars["--t-radius-button"] = l.buttonRadius;
  vars["--t-radius-card"] = l.cardRadius;
  vars["--t-grid-gap"] = l.gridGap;
  vars["--t-header-height"] = l.headerHeight;

  vars["--t-shadow"] = theme.effects.shadow;
  vars["--t-grain"] = theme.effects.grain ? "1" : "0";
  vars["--t-image-blend"] = theme.effects.imageBlend;
  vars["--t-glass"] = theme.effects.glass ? "1" : "0";
  return vars;
}

export function cssVarsToString(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}
