"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useAnimationConfig } from "./animation-provider";
import { gsap, ScrollTrigger } from "./gsap-utils";

type LenisApi = {
  /** Pause/resume page scrolling (drawers, menus). Falls back to body overflow without Lenis. */
  lock: (locked: boolean) => void;
  scrollTo: (target: string | HTMLElement | number) => void;
};

const LenisContext = createContext<LenisApi | null>(null);

/**
 * Lenis smooth scrolling driven by GSAP's ticker, so ScrollTrigger and Lenis share one RAF
 * and never drift. Disabled automatically with animations / reduced motion.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const { enabled, smoothScroll } = useAnimationConfig();
  const lenisRef = useRef<Lenis | null>(null);
  const active = enabled && smoothScroll.enabled;

  useEffect(() => {
    if (!active) return;
    const lenis = new Lenis({
      lerp: smoothScroll.lerp,
      wheelMultiplier: smoothScroll.wheelMultiplier,
      anchors: { offset: -80 },
      autoRaf: false,
    });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [active, smoothScroll.lerp, smoothScroll.wheelMultiplier]);

  const lock = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const scrollTo = useCallback((target: string | HTMLElement | number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: -80 });
      return;
    }
    if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
    else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return <LenisContext.Provider value={{ lock, scrollTo }}>{children}</LenisContext.Provider>;
}

export function useScrollControl(): LenisApi {
  const ctx = useContext(LenisContext);
  if (!ctx) throw new Error("useScrollControl must be used inside <LenisProvider>");
  return ctx;
}
