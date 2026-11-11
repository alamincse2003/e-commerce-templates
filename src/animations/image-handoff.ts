"use client";

import { ScrollTrigger } from "./gsap-utils";

type Options = {
  /** The pinned section the image leaves from — the flight starts where its pin ends. */
  after: ScrollTrigger;
  /** Element the image leaves (measured live; it may still be moving). */
  source: () => HTMLElement | null;
  /** Element the image lands in. */
  target: HTMLElement;
  /** Fixed-position flying copy of the image. */
  flyer: HTMLElement;
  /** Where the landing happens: target top at this fraction of the viewport. */
  landAt?: number;
};

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/**
 * Shared-element scroll transition. Between the end of `after` and the moment the target
 * reaches `landAt`, a fixed "flyer" interpolates its rect from the source to the target.
 * Both rects are read every frame, so the hand-off is exact at either end and reverses
 * naturally on scroll-up. Real images are hidden only while the flyer is in the air.
 */
export function createImageHandoff({ after, source, target, flyer, landAt = 0.16 }: Options) {
  let flying = false;
  target.setAttribute("data-handoff-target", "");

  const setFlying = (on: boolean) => {
    if (on === flying) return;
    flying = on;
    flyer.style.visibility = on ? "visible" : "hidden";
    const src = source();
    for (const el of [src, target]) {
      if (!el) continue;
      if (on) el.setAttribute("data-handoff-hidden", "");
      else el.removeAttribute("data-handoff-hidden");
    }
  };

  const frame = (p: number) => {
    const src = source();
    if (!src || p <= 0 || p >= 1) return setFlying(false);
    const a = src.getBoundingClientRect();
    const b = target.getBoundingClientRect();
    const e = easeInOut(p);
    const mix = (x: number, y: number) => x + (y - x) * e;
    const lift = Math.sin(Math.PI * e) * -36; // gentle arc
    flyer.style.left = `${mix(a.left, b.left)}px`;
    flyer.style.top = `${mix(a.top, b.top) + lift}px`;
    flyer.style.width = `${mix(a.width, b.width)}px`;
    flyer.style.height = `${mix(a.height, b.height)}px`;
    flyer.style.setProperty("--edge", String(1 - e)); // runway edge-fade melts away in flight
    setFlying(true);
  };

  const trigger = ScrollTrigger.create({
    start: () => after.end,
    end: () => target.getBoundingClientRect().top + window.scrollY - window.innerHeight * landAt,
    invalidateOnRefresh: true,
    onUpdate: (self) => frame(self.progress),
    onLeave: () => setFlying(false),
    onLeaveBack: () => setFlying(false),
  });

  return () => {
    trigger.kill();
    setFlying(false);
    target.removeAttribute("data-handoff-target");
  };
}
