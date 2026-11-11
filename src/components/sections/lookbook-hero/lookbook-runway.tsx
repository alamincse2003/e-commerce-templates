"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, ScrollTrigger, useGSAP } from "@/animations/gsap-utils";
import { createImageHandoff } from "@/animations/image-handoff";
import { useScrollControl } from "@/animations/lenis-provider";
import { RevealText } from "@/components/animations/reveal-text";
import { FadeIn } from "@/components/animations/fade-in";
import type { Product, ProductImage } from "@/config/schema/catalog";
import { pad2 } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";
import { toCartLine } from "@/components/products/to-cart-line";
import { RunwayProducts } from "./runway-products";
import { runwayPose, wrap } from "./runway-pose";

export type RunwayLook = {
  id: string;
  number: string;
  title: string;
  image: ProductImage;
  bundleDiscount: number;
  products: Product[];
};

type Props = { headingLevel: "h1" | "h2"; handoffProductId?: string; id: string; eyebrow?: string; title: string; description: string; looks: RunwayLook[] };

/**
 * Hero runway: the active look stands centre stage while upcoming looks wait in a blurred
 * queue that recedes in depth. "Next" walks the current look off and the queue steps forward.
 * Motion owns every card transform here; the title reveal is GSAP on a separate element.
 *
 * Scroll-driven (motion on): the section pins under the sticky header and each scroll step
 * walks the next look forward, snapping look to look. Arrows/keys scroll to the matching step,
 * so scroll position and the active look never disagree. When the last look is reached the
 * page continues. Motion off: plain arrows/keys carousel.
 */
export function LookbookRunway({ headingLevel, handoffProductId, id, eyebrow, title, description, looks }: Props) {
  const a = useAnimationConfig();
  const [active, setActive] = useState(0);
  const addMany = useCartStore((s) => s.addMany);
  const { scrollTo } = useScrollControl();
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const flyer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const n = looks.length;
  const look = looks[active];
  const scrollDriven = a.enabled && n > 1;

  useGSAP(
    () => {
      if (!scrollDriven || !track.current) return;
      const mm = gsap.matchMedia();
      // Desktop only: the hero is CSS-sticky inside a tall track (no DOM re-parenting, unlike a GSAP
      // pin, so the hero image paints once — good for LCP). Phones keep swipe + arrows.
      mm.add("(min-width: 1024px)", () => {
      const headerOffset = () => document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      trigger.current = ScrollTrigger.create({
        trigger: track.current,
        start: () => `top top+=${headerOffset()}`,
        end: "bottom bottom",
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / (n - 1), duration: { min: 0.25, max: 0.6 }, delay: 0.05, ease: "power1.inOut" },
        onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
      });

      // Hand-off: after the last look, its photo flies into the matching product card below.
      const target = handoffProductId ? document.querySelector<HTMLElement>(`[data-product-media="${handoffProductId}"]`) : null;
      const last = looks[n - 1].id;
      const stopHandoff =
        target && flyer.current
          ? createImageHandoff({
              after: trigger.current,
              source: () => root.current?.querySelector<HTMLElement>(`[data-look="${last}"]`) ?? null,
              target,
              flyer: flyer.current,
            })
          : null;

      return () => {
        stopHandoff?.();
        trigger.current = null;
      };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [a.signature, n, handoffProductId, scrollDriven], revertOnUpdate: true },
  );

  const go = useCallback(
    (i: number) => {
      const st = trigger.current;
      if (!st) return setActive(wrap(i, n));
      const target = Math.max(0, Math.min(n - 1, i));
      scrollTo(st.start + ((st.end - st.start) * target) / (n - 1));
    },
    [n, scrollTo],
  );
  const transition = a.enabled ? { duration: a.duration * 0.85, ease: a.ease.css } : { duration: 0 };

  const shopLook = () =>
    addMany(look.products.map((p) => toCartLine(p, { bundle: { lookId: look.id, discount: look.bundleDiscount } })));

  const controls = (
    <div className="flex items-center gap-3">
      <button type="button" onClick={() => go(active - 1)} aria-label="Previous look" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground">
        <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
      </button>
      <span className="flex w-16 flex-col items-center gap-1.5">
        <span className="t-small tabular-nums">
          {pad2(active + 1)} / {pad2(n)}
        </span>
        <span aria-hidden className="h-px w-full bg-border">
          <span className="block h-px bg-foreground transition-[width] duration-500" style={{ width: `${((active + 1) / n) * 100}%` }} />
        </span>
      </span>
      <button type="button" onClick={() => go(active + 1)} aria-label="Next look" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border transition-colors hover:border-foreground">
        <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
      </button>
    </div>
  );

  const lastLook = looks[n - 1];

  return (
    <>
    {/* Desktop scroll track: one viewport per look; the hero sticks under the header while it scrolls. */}
    <div
      ref={track}
      className={scrollDriven ? "relative lg:h-[calc(100svh-var(--t-header-height)+var(--runway-steps)*75svh)]" : "relative"}
      style={{ "--runway-steps": n - 1 } as React.CSSProperties}
    >
    <section
      ref={root}
      id={id}
      aria-roledescription="carousel"
      aria-label={`${title} lookbook`}
      className="relative overflow-hidden bg-background lg:sticky lg:top-[var(--t-header-height)]"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(active + 1);
        if (e.key === "ArrowLeft") go(active - 1);
      }}
    >
      <div className="container-theme grid grid-cols-[minmax(0,1fr)] gap-theme pt-6 pb-10 lg:h-[calc(100svh-var(--t-header-height))] lg:min-h-[600px] lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:pt-10">
        {/* Title block */}
        <div className="relative z-20 lg:col-span-4 lg:col-start-1 lg:row-start-1">
          {eyebrow ? <p className="t-small mb-4 text-muted-foreground">{eyebrow}</p> : null}
          <RevealText as={headingLevel} trigger={headingLevel === "h1" ? "load" : "scroll"} className="type-display t-hero split-safe max-w-[11ch]">
            {title}
          </RevealText>
          <FadeIn delay={0.35}>
            <p className="t-body mt-6 max-w-sm text-muted-foreground lg:max-w-[18rem]">{description}</p>
          </FadeIn>
        </div>

        {/* Stage */}
        <motion.div
          className="relative h-[60svh] min-h-[420px] touch-pan-y lg:col-span-7 lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:h-auto lg:min-h-[600px]"
          onPanEnd={(_, info) => {
            if (Math.abs(info.offset.x) < 40) return;
            go(active + (info.offset.x < 0 ? 1 : -1));
          }}
        >
          {/* Floor shadow under the active look */}
          <div aria-hidden className="absolute bottom-0 left-[58%] h-6 w-[36%] -translate-x-1/2 rounded-[50%] bg-foreground/15 blur-xl lg:left-[66%]" />
          {looks.map((l, i) => {
            const k = wrap(i - active, n);
            const pose = runwayPose(k, n);
            return (
              <motion.button
                key={l.id}
                data-look={l.id}
                type="button"
                onClick={() => go(i)}
                tabIndex={k === 0 ? -1 : 0}
                aria-label={k === 0 ? `Look ${l.number}, ${l.title} (current)` : `Show look ${l.number}, ${l.title}`}
                className="blend-theme absolute bottom-0 left-[58%] aspect-[3/4.4] h-[94%] origin-bottom outline-offset-4 lg:left-[66%]"
                initial={false}
                animate={pose}
                transition={transition}
                style={{ pointerEvents: pose.opacity === 0 ? "none" : "auto" }}
              >
                <Image
                  src={l.image.src}
                  alt={l.image.alt}
                  fill
                  priority={k <= 1}
                  sizes="(min-width: 1024px) 30vw, 60vw"
                  className="object-cover [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent),linear-gradient(to_bottom,transparent,#000_8%)] [mask-composite:intersect]"
                  style={{ objectPosition: l.image.position ?? "50% 30%" }}
                />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Products in the active look */}
        <aside aria-label={`Pieces in look ${look.number}`} className="relative z-20 lg:col-span-3 lg:col-start-10 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-[calc(var(--t-header-height)+1.5rem)]">
            <RunwayProducts look={look} />
            <div className="mt-8 hidden lg:flex">{controls}</div>
          </div>
        </aside>

        {/* Look meta + controls */}
        <div className="relative z-20 flex items-end justify-between gap-6 lg:col-span-4 lg:col-start-1 lg:row-start-2 lg:self-end">
          <div>
            <p className="t-small text-muted-foreground">Look</p>
            <div className="overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={look.id}
                  className="type-display text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.95]"
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={transition}
                  aria-live="polite"
                >
                  {look.number}
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="t-small mt-1">{look.title}</p>
            <button type="button" onClick={shopLook} className="t-small mt-4 underline underline-offset-4">
              Shop the look
            </button>
          </div>
          <div className="lg:hidden">{controls}</div>
        </div>
      </div>
    </section>
    </div>

    {/* Flying copy for the scroll hand-off. Lives outside the pinned section so the pin's
        transforms never affect its fixed positioning. Hidden until the flight starts. */}
    {handoffProductId ? (
      <div
        ref={flyer}
        aria-hidden
        className="pointer-events-none fixed z-30 overflow-hidden [--edge:1]"
        style={{
          visibility: "hidden",
          maskImage:
            "linear-gradient(to right, transparent, #000 calc(var(--edge) * 14%), #000 calc(100% - var(--edge) * 14%), transparent), linear-gradient(to bottom, transparent, #000 calc(var(--edge) * 8%))",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <Image
          src={lastLook.image.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: lastLook.image.position ?? "50% 30%" }}
        />
      </div>
    ) : null}
    </>
  );
}
