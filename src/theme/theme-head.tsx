import type { Theme } from "@/config/schema/theme";
import { cssVarsToString, themeToCssVars } from "./css-vars";

/** localStorage key holding the computed CSS vars of the last applied preview theme. */
export const THEME_CACHE_KEY = "nidus-theme-cache";

type Props = { theme: Theme; animationsEnabled: boolean; previewEnabled: boolean };

/**
 * Server-rendered <head> pieces:
 *  1. The client's theme as CSS variables (works without JS, no flash).
 *  2. A tiny blocking script that, in preview mode, re-applies cached panel overrides
 *     before first paint, and sets `data-motion` so CSS knows whether reveals will run.
 */
export function ThemeHead({ theme, animationsEnabled, previewEnabled }: Props) {
  const css = `:root{${cssVarsToString(themeToCssVars(theme))}}`;
  const script = `(function(){var d=document.documentElement,m=${animationsEnabled ? "'on'" : "'off'"};try{${
    previewEnabled
      ? `var c=JSON.parse(localStorage.getItem('${THEME_CACHE_KEY}')||'null');if(c){for(var k in c.vars)d.style.setProperty(k,c.vars[k]);if(c.motion)m=c.motion;}`
      : ""
  }if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)m='off';}catch(e){}d.setAttribute('data-motion',m);})();`;

  return (
    <>
      <style id="theme-vars" dangerouslySetInnerHTML={{ __html: css }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  );
}
