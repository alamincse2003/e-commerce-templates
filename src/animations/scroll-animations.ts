"use client";

import type { AnimationContextValue } from "./animation-provider";
import { gsap, SplitText } from "./gsap-utils";

/**
 * Reusable GSAP + ScrollTrigger recipes. Call them inside `useGSAP` so every tween and
 * trigger is scoped to the component and reverted automatically on unmount.
 */

const CLIP_FROM: Record<AnimationContextValue["image"]["clip"], string> = {
  up: "inset(100% 0% 0% 0%)",
  left: "inset(0% 100% 0% 0%)",
  center: "inset(42% 42% 42% 42%)",
  none: "inset(0% 0% 0% 0%)",
};
const CLIP_TO = "inset(0% 0% 0% 0%)";

/** Masked image reveal: the frame un-clips while the inner image settles from a zoom. */
export function imageReveal(frame: HTMLElement, inner: HTMLElement, a: AnimationContextValue, trigger?: gsap.DOMTarget) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: trigger ?? frame, start: a.scroll.start, once: a.scroll.once },
    defaults: { duration: a.duration * 1.15, ease: a.ease.gsap },
  });
  tl.set(frame, { visibility: "visible" });
  if (a.image.clip === "none") tl.from(frame, { opacity: 0 });
  else tl.fromTo(frame, { clipPath: CLIP_FROM[a.image.clip] }, { clipPath: CLIP_TO });
  tl.fromTo(inner, { scale: a.image.scale }, { scale: 1, duration: a.duration * 1.6 }, 0);
  return tl;
}

/** Scrubbed vertical drift of `inner` inside a clipped `frame`. */
export function parallax(frame: HTMLElement, inner: HTMLElement, strength: number) {
  if (strength <= 0) return;
  return gsap.fromTo(
    inner,
    { yPercent: -strength },
    {
      yPercent: strength,
      ease: "none",
      scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

/** Split text reveal through line masks. Returns the SplitText instance for cleanup. */
export function splitReveal(
  el: HTMLElement,
  a: AnimationContextValue,
  opts: { split?: AnimationContextValue["text"]["split"]; delay?: number; onScroll?: boolean },
) {
  const mode = opts.split ?? a.text.split;
  const type = mode === "lines" ? "lines" : mode === "words" ? "lines,words" : "lines,words,chars";
  return SplitText.create(el, {
    type,
    mask: "lines",
    aria: "none",
    autoSplit: true,
    onSplit(self) {
      gsap.set(el, { visibility: "visible" });
      const targets = mode === "lines" ? self.lines : mode === "words" ? self.words : self.chars;
      return gsap.from(targets, {
        yPercent: a.text.yPercent,
        rotate: a.text.rotate,
        opacity: mode === "lines" ? 1 : 0,
        duration: a.duration,
        ease: a.ease.gsap,
        stagger: mode === "chars" ? a.stagger * 0.35 : a.stagger,
        delay: a.delay + (opts.delay ?? 0),
        scrollTrigger: opts.onScroll === false ? undefined : { trigger: el, start: a.scroll.start, once: a.scroll.once },
      });
    },
  });
}

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export function scrubWords(el: HTMLElement) {
  const split = SplitText.create(el, { type: "words", aria: "none" });
  gsap.fromTo(
    split.words,
    { opacity: 0.16 },
    {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
    },
  );
  return split;
}
