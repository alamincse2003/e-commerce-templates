"use client";

import { MotionConfig } from "motion/react";
import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { useShallow } from "zustand/react/shallow";
import type { AnimationConfig, ResolvedAnimation } from "@/config/schema/animation";
import { usePreviewStore } from "@/store/preview-store";
import { resolveAnimation } from "./animation-presets";
import { ScrollTrigger } from "./gsap-utils";

export type AnimationContextValue = ResolvedAnimation & {
  reducedMotion: boolean;
  /** Changes whenever anything animation-related changes; use as an effect dependency. */
  signature: string;
};

const AnimationContext = createContext<AnimationContextValue | null>(null);

const QUERY = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

export function AnimationProvider({ base, children }: { base: AnimationConfig; children: React.ReactNode }) {
  const preview = usePreviewStore(useShallow((s) => s.animation));
  const reducedMotion = usePrefersReducedMotion();

  const value = useMemo<AnimationContextValue>(() => {
    const resolved = resolveAnimation({
      ...base,
      preset: preview.preset ?? base.preset,
      durationScale: preview.durationScale ?? base.durationScale,
      enabled: preview.enabled ?? base.enabled,
      smoothScroll: { ...base.smoothScroll, enabled: preview.smoothScroll ?? base.smoothScroll.enabled },
    });
    const enabled = resolved.enabled && !reducedMotion;
    return {
      ...resolved,
      enabled,
      reducedMotion,
      signature: [resolved.preset, resolved.durationScale, enabled, resolved.smoothScroll.enabled].join(":"),
    };
  }, [base, preview, reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.motion = value.enabled ? "on" : "off";
    document.documentElement.style.setProperty("--marquee-duration", `${value.marqueeDuration}s`);
    // Layout may change when animation modes switch (e.g. pinned story on/off).
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 60);
    return () => window.clearTimeout(id);
  }, [value.enabled, value.marqueeDuration, value.signature]);

  return (
    <AnimationContext.Provider value={value}>
      <MotionConfig reducedMotion={value.enabled ? "never" : "always"}>{children}</MotionConfig>
    </AnimationContext.Provider>
  );
}

export function useAnimationConfig(): AnimationContextValue {
  const ctx = useContext(AnimationContext);
  if (!ctx) throw new Error("useAnimationConfig must be used inside <AnimationProvider>");
  return ctx;
}
