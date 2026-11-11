"use client";

import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import type { Theme } from "@/config/schema/theme";
import { THEME_PRESETS } from "@/config/themes";
import { usePreviewStore } from "@/store/preview-store";
import { applyThemeOverrides } from "./apply-overrides";
import { themeToCssVars } from "./css-vars";
import { THEME_CACHE_KEY } from "./theme-head";

/**
 * Preview mode only: applies panel overrides as inline CSS variables on <html> and caches the
 * result so the boot script can restore it before first paint on the next visit.
 */
export function ThemeController({ clientTheme }: { clientTheme: Theme }) {
  const { themeId, colors, fonts, animation } = usePreviewStore(
    useShallow((s) => ({ themeId: s.themeId, colors: s.colors, fonts: s.fonts, animation: s.animation })),
  );
  const applied = useRef<string[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const isDefault = themeId === "client" && !Object.keys(colors).length && !Object.keys(fonts).length;

    for (const key of applied.current) root.style.removeProperty(key);
    applied.current = [];

    const motion = animation.enabled === false ? "off" : undefined;
    if (isDefault) {
      try {
        if (motion) localStorage.setItem(THEME_CACHE_KEY, JSON.stringify({ vars: {}, motion }));
        else localStorage.removeItem(THEME_CACHE_KEY);
      } catch {}
      return;
    }

    const base = themeId === "client" ? clientTheme : THEME_PRESETS[themeId];
    const vars = themeToCssVars(applyThemeOverrides(base, { colors, fonts }));
    for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v);
    applied.current = Object.keys(vars);
    try {
      localStorage.setItem(THEME_CACHE_KEY, JSON.stringify({ vars, motion }));
    } catch {}
  }, [themeId, colors, fonts, animation.enabled, clientTheme]);

  return null;
}
