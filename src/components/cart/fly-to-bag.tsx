"use client";

import { useEffect } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap } from "@/animations/gsap-utils";

/**
 * Add-to-bag feedback. Any element marked `data-add-to-bag` (button) flies the nearest product
 * photo into the header bag (`data-bag-icon`), which then bumps. One delegated listener, so new
 * add buttons only need the attribute. Disabled with motion off.
 */
export function FlyToBag() {
  const a = useAnimationConfig();

  useEffect(() => {
    if (!a.enabled) return;

    const bump = (bag: HTMLElement) =>
      gsap.fromTo(bag, { scale: 1 }, { scale: 1.28, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1, overwrite: true });

    const onClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-add-to-bag]");
      if (!btn || (btn as HTMLButtonElement).disabled) return;
      const bag = document.querySelector<HTMLElement>("[data-bag-icon]");
      if (!bag) return;

      // Nearest product photo: the closest card-ish container that holds an <img>.
      const scope = btn.closest("[data-product-scope], article, li, form, section");
      const img = scope?.querySelector<HTMLImageElement>("img");
      if (!img) return void bump(bag);

      const from = img.getBoundingClientRect();
      const to = bag.getBoundingClientRect();
      const size = Math.min(from.width, from.height, 160);
      const ghost = img.cloneNode() as HTMLImageElement;
      ghost.removeAttribute("srcset");
      ghost.src = img.currentSrc || img.src;
      Object.assign(ghost.style, {
        position: "fixed",
        left: `${from.left + from.width / 2 - size / 2}px`,
        top: `${from.top + from.height / 2 - size / 2}px`,
        width: `${size}px`,
        height: `${size * 1.25}px`,
        objectFit: "cover",
        zIndex: "85",
        pointerEvents: "none",
        borderRadius: "2px",
        boxShadow: "0 12px 30px -10px rgb(0 0 0 / .35)",
      });
      document.body.appendChild(ghost);

      const dx = to.left + to.width / 2 - (from.left + from.width / 2);
      const dy = to.top + to.height / 2 - (from.top + from.height / 2);
      gsap
        .timeline({ onComplete: () => ghost.remove() })
        .to(ghost, { x: dx, duration: 0.75, ease: "power2.inOut" }, 0)
        .to(ghost, { y: dy, duration: 0.75, ease: "back.in(1.1)" }, 0) // arcs up, then drops in
        .to(ghost, { scale: 0.12, opacity: 0.6, duration: 0.75, ease: "power2.in" }, 0)
        .add(() => bump(bag), 0.7);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [a.enabled]);

  return null;
}
