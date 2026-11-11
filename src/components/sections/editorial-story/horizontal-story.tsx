"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, useGSAP } from "@/animations/gsap-utils";
import { imageReveal } from "@/animations/scroll-animations";
import { RevealText } from "@/components/animations/reveal-text";
import { Button } from "@/components/ui/button";
import type { ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";

type Chapter = { numeral: string; title: string; body: string; image: ProductImage };
type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  intro: string;
  chapters: Chapter[];
  outro: { title: string; cta: { label: string; href: string } };
  pinned: boolean;
};

/**
 * Desktop + horizontal-capable preset: the section pins and the track scrolls sideways,
 * with chapter images un-masking as they enter (ScrollTrigger containerAnimation).
 * Otherwise (mobile, Minimal preset, motion off, no JS) it is a vertical story — the horizontal
 * layout only exists while the section is pinned (`.is-pinned` toggled by GSAP matchMedia).
 */
export function HorizontalStory({ id, eyebrow, title, intro, chapters, outro, pinned }: Props) {
  const a = useAnimationConfig();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const sec = section.current;
      const tr = track.current;
      if (!a.enabled || !sec || !tr) return;
      const mm = gsap.matchMedia();

      const verticalReveals = () => {
        gsap.utils.toArray<HTMLElement>(".story-media", sec).forEach((frame) => {
          const inner = frame.querySelector<HTMLElement>(".story-media-inner");
          if (inner) imageReveal(frame, inner, a);
        });
      };

      mm.add({ desktop: "(min-width: 1024px)" }, (ctx) => {
        if (!ctx.conditions?.desktop || !a.horizontalStory || !pinned) {
          verticalReveals();
          return;
        }
        sec.classList.add("is-pinned");
        const distance = () => tr.scrollWidth - window.innerWidth;
        const scroller = gsap.to(tr, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: typeof a.scroll.scrub === "number" ? a.scroll.scrub : 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        gsap.utils.toArray<HTMLElement>(".story-media", sec).forEach((frame) => {
          const inner = frame.querySelector<HTMLElement>(".story-media-inner");
          gsap.fromTo(
            frame,
            { clipPath: "inset(0% 0% 0% 100%)" },
            { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: frame, containerAnimation: scroller, start: "left 95%", end: "left 45%", scrub: true } },
          );
          if (inner) {
            gsap.fromTo(inner, { xPercent: -10, scale: a.image.scale }, { xPercent: 10, scale: 1, ease: "none", scrollTrigger: { trigger: frame, containerAnimation: scroller, start: "left right", end: "right left", scrub: true } });
          }
        });
        gsap.utils.toArray<HTMLElement>(".story-numeral", sec).forEach((el) => {
          gsap.fromTo(el, { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: { trigger: el, containerAnimation: scroller, start: "left right", end: "right left", scrub: true } });
        });
        return () => sec.classList.remove("is-pinned");
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [a.signature, pinned], revertOnUpdate: true },
  );

  return (
    <section
      ref={section}
      id={id}
      aria-labelledby={`${id}-title`}
      className="group/story relative bg-surface [&.is-pinned]:overflow-hidden"
    >
      <div
        ref={track}
        className="flex flex-col gap-20 px-[max(1rem,4vw)] py-24 lg:gap-28 lg:px-[6vw] group-[.is-pinned]/story:h-svh group-[.is-pinned]/story:w-max group-[.is-pinned]/story:flex-row group-[.is-pinned]/story:items-center group-[.is-pinned]/story:gap-[7vw] group-[.is-pinned]/story:py-0"
      >
        <div className="max-w-xl group-[.is-pinned]/story:w-[30vw] group-[.is-pinned]/story:max-w-none">
          {eyebrow ? <p className="t-small mb-3 text-muted-foreground">{eyebrow}</p> : null}
          <RevealText as="h2" id={`${id}-title`} className="type-display t-hero split-safe">
            {title}
          </RevealText>
          <p className="t-body mt-6 max-w-sm text-muted-foreground">{intro}</p>
          <p className="t-small mt-10 hidden items-center gap-3 text-muted-foreground group-[.is-pinned]/story:flex">
            Scroll <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>

        {chapters.map((ch, i) => (
          <article
            key={ch.numeral}
            className={cn("grid items-center gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-[4vw] group-[.is-pinned]/story:w-[min(68vw,1080px)]", i % 2 === 1 && "lg:[&>*:first-child]:order-2")}
          >
            <div className={cn("story-media relative aspect-[4/5] w-full overflow-hidden rounded-card bg-muted lg:max-w-[560px] group-[.is-pinned]/story:h-[72svh] group-[.is-pinned]/story:w-auto group-[.is-pinned]/story:max-w-none", i % 2 === 1 && "group-[.is-pinned]/story:mt-[10svh]")}>
              <div className="story-media-inner absolute inset-[-6%]">
                <Image src={ch.image.src} alt={ch.image.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
              </div>
            </div>
            <div className="relative">
              <p className="story-numeral t-small text-muted-foreground">
                Chapter {ch.numeral}
              </p>
              <h3 className="type-heading t-h1 mt-3">{ch.title}</h3>
              <p className="t-body mt-4 max-w-sm text-muted-foreground">{ch.body}</p>
            </div>
          </article>
        ))}

        <div className="flex flex-col items-start gap-8 group-[.is-pinned]/story:w-[34vw] group-[.is-pinned]/story:pr-[6vw]">
          <p className="type-heading t-h1">{outro.title}</p>
          <Button href={outro.cta.href} variant="outline">
            {outro.cta.label}
            <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
          </Button>
        </div>
      </div>
    </section>
  );
}
