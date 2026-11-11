"use client";

import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, ScrollTrigger, useGSAP } from "@/animations/gsap-utils";

const SELECTOR = "[data-product-media]:not([data-handoff-target]), [data-collection-media]";

/**
 * Unmasks grid photos bottom-up, in batches, the first time they scroll into view.
 * GSAP animates only the media frames (the surrounding list items stay Motion-owned).
 * Skips the scroll hand-off target so the flying image always lands on a fully visible card.
 */
export function RevealMedia({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const a = useAnimationConfig();

  useGSAP(
    () => {
      if (!a.enabled || !root.current) return;
      const items = gsap.utils.toArray<HTMLElement>(SELECTOR, root.current);
      gsap.set(items, { clipPath: "inset(100% 0% 0% 0%)" });
      ScrollTrigger.batch(items, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: a.duration, ease: a.ease.gsap, stagger: a.stagger, overwrite: true }),
      });
    },
    { scope: root, dependencies: [a.signature], revertOnUpdate: true },
  );

  return <div ref={root}>{children}</div>;
}
