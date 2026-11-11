"use client";

import Image from "next/image";
import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, SplitText, useGSAP } from "@/animations/gsap-utils";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { INTRO_SEEN_KEY } from "@/theme/theme-head";

type Props = {
  id: string;
  introTitle: string;
  eyebrow?: string;
  title: string;
  description?: string;
  images: ProductImage[];
  ctas: { label: string; href: string }[];
  stageColor?: string;
  stageText?: string;
  headingLevel: "h1" | "h2";
};

/** Final resting slots for the three photos (left/back, centre/main, right/front). */
const SLOTS = [
  "left-0 top-[4%] h-[42%] z-10 lg:top-[10%] lg:h-[50%]",
  "left-1/2 -translate-x-1/2 bottom-0 h-[86%] z-20 lg:h-[84%]",
  "right-0 bottom-[6%] h-[42%] z-10 lg:z-30 lg:top-[36%] lg:bottom-auto lg:h-[50%]",
];

/** Where each photo enters from (offset from its centre-stack position, px) and its fan pose. */
const ENTRY = [
  { x: -1.1, y: 0.25, r: -24 },
  { x: 0, y: 1.1, r: 8 },
  { x: 1.1, y: 0.2, r: 22 },
];
const FAN = [
  { x: -0.07, r: -9 },
  { x: 0, r: 0 },
  { x: 0.07, r: 9 },
];

/**
 * Cinematic hero (first visit per session, ~3.5s, skippable):
 *   0.0  intro line reveals letter by letter, centre stage
 *   0.45 three photos fly in on curved paths from the edges and land as a fanned stack
 *   1.8  the stack opens into the final editorial layout; intro line lifts away
 *   2.3  headline, copy and buttons rise in — the hero is live
 * The markup IS the final layout (SEO / no-JS / reduced motion / return visits see it directly).
 */
export function IntroHeroClient(props: Props) {
  const { id, introTitle, eyebrow, title, description, images, ctas, stageColor, stageText, headingLevel } = props;
  const a = useAnimationConfig();
  const root = useRef<HTMLElement>(null);
  const Heading = headingLevel;

  useGSAP(
    (_ctx, contextSafe) => {
      const html = document.documentElement;
      const finish = () => {
        html.classList.remove("intro-pending");
        try {
          sessionStorage.setItem(INTRO_SEEN_KEY, "1");
        } catch {}
      };
      const el = root.current;
      if (!el || !a.enabled || !html.classList.contains("intro-pending") || !contextSafe) {
        html.classList.remove("intro-pending");
        return;
      }

      const q = gsap.utils.selector(el);
      const photos = q<HTMLElement>(".intro-photo");
      const box = el.getBoundingClientRect();
      const W = box.width;
      const H = box.height;
      // Centre of the stage, a touch below middle (leaves room for the intro line).
      const cx = box.left + W / 2;
      const cy = box.top + H * 0.6;
      const toCentre = photos.map((p) => {
        const r = p.getBoundingClientRect();
        return { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2) };
      });

      // words+chars keeps words intact when the line wraps on phones.
      const split = SplitText.create(q(".intro-line")[0], { type: "words,chars", mask: "chars" });
      const tl = gsap.timeline({ onComplete: finish });

      tl.set(q("[data-intro='hide']"), { autoAlpha: 0 })
        .set(q(".intro-line"), { autoAlpha: 1 }, 0)
        .fromTo(split.chars, { yPercent: 120 }, { yPercent: 0, duration: 0.7, stagger: 0.025, ease: "power3.out" }, 0);

      photos.forEach((p, i) => {
        const c = toCentre[i];
        const e = ENTRY[i];
        const f = FAN[i];
        tl.set(p, { autoAlpha: 1, x: c.x + e.x * W, y: c.y + e.y * H, rotation: e.r, scale: 0.6 }, 0)
          // Curved flight: overshoot past the stack on an arc, then settle into the fan.
          .to(p, { keyframes: [
            { x: c.x + f.x * W * 2.2, y: c.y - H * 0.08, rotation: f.r * 1.8, scale: 0.6, duration: 0.6, ease: "power2.out" },
            { x: c.x + f.x * W, y: c.y, rotation: f.r, scale: 0.56, duration: 0.45, ease: "power2.inOut" },
          ] }, 0.45 + i * 0.12);
      });

      tl.to(q(".intro-line"), { autoAlpha: 0, y: -30, duration: 0.5, ease: "power2.in" }, 1.75)
        .to(photos, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.95, ease: "power3.inOut", stagger: 0.06 }, 1.8)
        .set(q(".intro-overlay"), { autoAlpha: 0 }, 2.3)
        .fromTo(q(".intro-copy > *"), { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }, 2.3)
        .fromTo(q(".intro-copy"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, 2.3);

      // Any intent to move on fast-forwards the intro.
      const skip = contextSafe(() => tl.timeScale(6));
      const events = ["wheel", "touchstart", "keydown"] as const;
      events.forEach((type) => window.addEventListener(type, skip, { once: true, passive: true }));
      q(".intro-skip")[0]?.addEventListener("click", skip);

      return () => {
        events.forEach((type) => window.removeEventListener(type, skip));
        split.revert();
        finish();
      };
    },
    { scope: root, dependencies: [a.signature] },
  );

  return (
    <section
      ref={root}
      id={id}
      aria-labelledby={`${id}-title`}
      className="relative isolate overflow-hidden"
      style={{ background: stageColor ?? "var(--t-surface)", color: stageText }}
    >
      <div className="container-theme relative grid h-[calc(100svh-var(--t-header-height)-2.25rem)] min-h-[620px] grid-rows-[auto_1fr] gap-6 pt-8 lg:grid-cols-12 lg:grid-rows-1 lg:pt-0">
        {/* Copy */}
        <div data-intro="hide" className="intro-copy relative z-40 lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:self-center">
          {eyebrow ? <p className="t-small opacity-80">{eyebrow}</p> : null}
          <Heading id={`${id}-title`} className="type-display t-hero mt-3 max-w-[13ch]">
            {title}
          </Heading>
          {description ? <p className="t-body mt-5 max-w-sm opacity-80">{description}</p> : null}
          {ctas.length ? (
            <div className="mt-7 flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <Button key={cta.href + cta.label} href={cta.href} variant={i === 0 ? "primary" : "outline"}>
                  {cta.label}
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Photo composition */}
        <div className="relative lg:col-span-7 lg:col-start-6 lg:row-start-1 xl:col-span-8 xl:col-start-5">
          {images.map((img, i) => (
            // Wrapper owns the CSS slot position; the inner layer is GSAP's to move.
            <div key={img.src} className={cn("absolute aspect-[4/5]", SLOTS[i])}>
              <div data-intro="hide" className="intro-photo relative h-full w-full will-change-transform">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 30vw, 50vw"
                  className="object-cover shadow-theme"
                  style={{ objectPosition: img.position ?? "50% 20%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intro-only layer (hidden unless the intro is pending) */}
      <div data-intro="overlay" className="intro-overlay pointer-events-none absolute inset-0 z-50 flex-col items-center">
        <p aria-hidden className="intro-line invisible type-display mt-[9vh] px-4 text-center text-[clamp(1.75rem,4.4vw,4rem)] tracking-[0.08em] uppercase">
          {introTitle}
        </p>
        <button type="button" className="intro-skip t-small pointer-events-auto absolute right-5 bottom-5 underline underline-offset-4 opacity-80 hover:opacity-100">
          Skip intro
        </button>
      </div>
    </section>
  );
}
