"use client";

import { useId, useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, useGSAP } from "@/animations/gsap-utils";
import { MotifArt, type MotifId } from "./motifs";

/** Brand line-art that stitches itself in as it scrolls through the viewport (GSAP DrawSVG, scrubbed). */
export function MotifDividerClient({ motif, caption }: { motif: MotifId; caption?: string }) {
  const a = useAnimationConfig();
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  useGSAP(
    () => {
      if (!a.enabled || !root.current) return;
      const paths = gsap.utils.toArray<SVGElement>("[data-draw]", root.current);
      gsap.fromTo(
        paths,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          ease: "none",
          stagger: 0.02,
          scrollTrigger: { trigger: root.current, start: "top 88%", end: "top 45%", scrub: 0.6 },
        },
      );
      if (caption) {
        gsap.fromTo(
          root.current.querySelector(".motif-caption"),
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, scrollTrigger: { trigger: root.current, start: "top 60%", end: "top 45%", scrub: 0.6 } },
        );
      }
    },
    { scope: root, dependencies: [a.signature, motif], revertOnUpdate: true },
  );

  return (
    <div ref={root} className="container-theme py-10 text-accent lg:py-14" aria-hidden={caption ? undefined : true}>
      <svg viewBox="0 0 1200 120" className="mx-auto block h-auto w-full max-w-5xl" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <MotifArt motif={motif} uid={uid} />
      </svg>
      {caption ? <p className="motif-caption t-small mt-4 text-center text-muted-foreground">{caption}</p> : null}
    </div>
  );
}
