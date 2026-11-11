import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { FontKey } from "@/config/fonts.meta";
import type { AnimationPresetId } from "@/config/schema/animation";
import type { ThemePresetId } from "@/config/themes";
import type { ColorOverrideKey, FontOverrideKey } from "@/theme/apply-overrides";

/** "client" = the active client's own theme config. */
export type PreviewThemeId = ThemePresetId | "client";

export type PreviewAnimation = {
  preset?: AnimationPresetId;
  durationScale?: number;
  enabled?: boolean;
  smoothScroll?: boolean;
};

type PreviewState = {
  themeId: PreviewThemeId;
  colors: Partial<Record<ColorOverrideKey, string>>;
  fonts: Partial<Record<FontOverrideKey, FontKey>>;
  animation: PreviewAnimation;
  setTheme: (id: PreviewThemeId) => void;
  setColor: (key: ColorOverrideKey, value: string) => void;
  setFont: (key: FontOverrideKey, value: FontKey) => void;
  setAnimation: (patch: PreviewAnimation) => void;
  reset: () => void;
};

const initial = { themeId: "client" as PreviewThemeId, colors: {}, fonts: {}, animation: {} };

/**
 * Preview-only overrides for the customization panel. Persisted locally; never affects
 * production builds where the panel is disabled. Hydrated manually (see StoreHydrator)
 * so server and first client render always agree.
 */
export const usePreviewStore = create<PreviewState>()(
  persist(
    (set) => ({
      ...initial,
      // Switching preset clears color/font tweaks so the preset is seen as designed.
      setTheme: (themeId) => set({ themeId, colors: {}, fonts: {} }),
      setColor: (key, value) => set((s) => ({ colors: { ...s.colors, [key]: value } })),
      setFont: (key, value) => set((s) => ({ fonts: { ...s.fonts, [key]: value } })),
      setAnimation: (patch) => set((s) => ({ animation: { ...s.animation, ...patch } })),
      reset: () => set(initial),
    }),
    {
      name: "nidus-preview",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ themeId, colors, fonts, animation }) => ({ themeId, colors, fonts, animation }),
    },
  ),
);
