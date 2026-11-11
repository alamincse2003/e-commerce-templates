import type { Transition, Variants } from "motion/react";
import type { AnimationContextValue } from "./animation-provider";

/** Shared transition built from the active preset. */
export function presetTransition(a: AnimationContextValue, delay = 0): Transition {
  if (!a.enabled) return { duration: 0 };
  return { duration: a.duration, ease: a.ease.css, delay: a.delay + delay };
}

/** Entrance used by <FadeIn> and stagger children. */
export function fadeUpVariants(a: AnimationContextValue, delay = 0): Variants {
  const blur = a.reveal.blur > 0;
  return {
    hidden: {
      opacity: 0,
      y: a.reveal.y,
      scale: a.reveal.scale,
      ...(blur ? { filter: `blur(${a.reveal.blur}px)` } : {}),
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      ...(blur ? { filter: "blur(0px)" } : {}),
      transition: presetTransition(a, delay),
    },
  };
}

export function staggerVariants(a: AnimationContextValue, delay = 0): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: a.enabled ? a.stagger : 0, delayChildren: a.enabled ? a.delay + delay : 0 } },
  };
}

/** Quick UI transitions (drawers, menus, popovers) — intentionally faster than reveals. */
export function uiTransition(a: AnimationContextValue): Transition {
  if (!a.enabled) return { duration: 0 };
  return { duration: Math.min(0.6, a.duration * 0.5), ease: a.ease.css };
}
