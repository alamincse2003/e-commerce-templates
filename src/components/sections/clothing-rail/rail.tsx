"use client";

import { useRef, useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { clamp, gsap, ScrollTrigger, useGSAP } from "@/animations/gsap-utils";
import { GarmentSvg } from "@/components/products/garment-svg";
import { usePrice } from "@/components/providers/site-provider";
import type { Product } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { AvailabilityPanel } from "./availability-panel";

type Props = { products: Product[]; cta: string };

/**
 * GSAP owns the swing layer of each garment (`.rail-swing`): entrance drop, idle sway, and a
 * "brush" impulse when the pointer moves across the rail. Opacity dimming is plain CSS on the
 * outer button, so nothing fights over the same property.
 */
export function Rail({ products, cta }: Props) {
  const a = useAnimationConfig();
  const price = usePrice();
  const root = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const focus = hovered ?? selected;

  useGSAP(
    (_ctx, contextSafe) => {
      const el = root.current;
      if (!a.enabled || !el || !contextSafe) return;
      const swings = gsap.utils.toArray<HTMLElement>(".rail-swing");
      let inView = false;
      let sway: gsap.core.Timeline | null = null;

      // Idle sway — very subtle, starts after the entrance and pauses off screen.
      const startSway = () => {
        sway = gsap.timeline();
        swings.forEach((el, i) => {
          sway!.to(el, { rotation: i % 2 ? 0.9 : -0.9, duration: 2.6 + (i % 3) * 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 }, i * 0.15);
        });
        if (!inView) sway.pause();
      };

      gsap.from(swings, {
        yPercent: -45,
        rotation: () => gsap.utils.random(-14, 14),
        opacity: 0,
        duration: a.duration * 1.1,
        ease: "back.out(1.4)",
        stagger: { each: a.stagger * 0.6, from: "center" },
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        onComplete: startSway,
      });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (st) => {
          inView = st.isActive;
          if (inView) sway?.play();
          else sway?.pause();
        },
      });

      // Pointer "brushing" through the rail swings nearby garments with the hand's velocity.
      let last: { x: number; t: number } | null = null;
      const onMove = contextSafe((e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const now = performance.now();
        const prev = last;
        last = { x: e.clientX, t: now };
        if (!prev) return;
        const v = (e.clientX - prev.x) / Math.max(1, now - prev.t); // px per ms
        if (Math.abs(v) < 0.15) return;
        swings.forEach((swing) => {
          const r = swing.getBoundingClientRect();
          if (Math.abs(r.left + r.width / 2 - e.clientX) > r.width * 0.8) return;
          gsap.to(swing, {
            rotation: clamp(v * 9, -16, 16),
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
            onComplete: () => void gsap.to(swing, { rotation: 0, duration: 2.2, ease: "elastic.out(1, 0.25)" }),
          });
        });
      });
      const onLeave = () => (last = null);
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);

      // Lift the hovered/focused garment off the rail.
      const items = gsap.utils.toArray<HTMLElement>(".rail-item");
      const unbind = items.map((item, i) => {
        const up = contextSafe(() => gsap.to(swings[i], { y: -14, scale: 1.05, duration: 0.6, ease: a.ease.gsap }));
        const down = contextSafe(() => gsap.to(swings[i], { y: 0, scale: 1, duration: 0.6, ease: a.ease.gsap }));
        const events = [["pointerenter", up], ["focus", up], ["pointerleave", down], ["blur", down]] as const;
        events.forEach(([type, fn]) => item.addEventListener(type, fn));
        return () => events.forEach(([type, fn]) => item.removeEventListener(type, fn));
      });

      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        unbind.forEach((fn) => fn());
      };
    },
    { scope: root, dependencies: [a.signature], revertOnUpdate: true },
  );

  const active = focus !== null ? products[focus] : null;

  return (
    <div ref={root} className="relative pt-14 pb-12 lg:pt-20">
      {/* Chrome rail */}
      <div aria-hidden className="absolute inset-x-[4%] top-[calc(3.5rem+1px)] z-10 lg:top-[calc(5rem+2px)]">
        <div className="h-2.5 rounded-full bg-[linear-gradient(180deg,#fafafa_0%,#bdbdbd_38%,#6b6b6b_62%,#d9d9d9_100%)] shadow-[0_6px_14px_rgba(0,0,0,.45)]" />
        <div className="absolute -top-1.5 -left-1 h-5 w-3 rounded-sm bg-[linear-gradient(90deg,#9a9a9a,#efefef,#8a8a8a)]" />
        <div className="absolute -top-1.5 -right-1 h-5 w-3 rounded-sm bg-[linear-gradient(90deg,#8a8a8a,#efefef,#9a9a9a)]" />
      </div>

      <ul className="no-scrollbar relative z-20 -mx-4 flex snap-x snap-mandatory gap-1 overflow-x-auto px-[6%] lg:mx-0 lg:justify-center lg:overflow-visible lg:px-[5%]" aria-label="Limited run pieces">
        {products.map((p, i) => (
          <li key={p.id} className="relative w-[34vw] max-w-[150px] shrink-0 snap-center sm:w-[22vw] lg:w-auto lg:flex-1">
            <button
              type="button"
              className={cn(
                "rail-item group relative block w-full outline-offset-8 transition-opacity duration-500",
                focus !== null && focus !== i && "opacity-35",
              )}
              aria-label={`${p.name}, ${price(p.price)}`}
              aria-pressed={selected === i}
              onPointerEnter={() => setHovered(i)}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => {
                setSelected(i);
                setPanelOpen(true);
              }}
            >
              <div className="rail-swing origin-top will-change-transform">
                <GarmentSvg garment={p.garment!} className="w-full drop-shadow-[0_18px_22px_rgba(0,0,0,.45)]" />
              </div>
            </button>
            <div className={cn("pointer-events-none mt-3 text-center transition-opacity duration-300", focus === i ? "opacity-100" : "opacity-0")} aria-hidden>
              <p className="t-small">{p.name}</p>
              <p className="mt-1 text-xs tabular-nums opacity-70">{price(p.price)}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-col items-center gap-6">
        <button
          type="button"
          onClick={() => {
            if (selected === null) setSelected(focus ?? 0);
            setPanelOpen((o) => !o);
          }}
          aria-expanded={panelOpen}
          className="t-label rounded-button border border-inverse-foreground/50 px-6 py-3 transition-colors hover:bg-inverse-foreground hover:text-inverse"
        >
          {cta}
        </button>
        <AvailabilityPanel open={panelOpen} product={active ?? products[selected ?? 0]} onClose={() => setPanelOpen(false)} />
      </div>
    </div>
  );
}
