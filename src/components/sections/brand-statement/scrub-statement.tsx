"use client";

import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { useGSAP } from "@/animations/gsap-utils";
import { scrubWords } from "@/animations/scroll-animations";

/** Large statement whose words light up as you scroll through it (GSAP ScrollTrigger scrub). */
export function ScrubStatement({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const a = useAnimationConfig();

  useGSAP(
    () => {
      if (!a.enabled || !ref.current) return;
      const split = scrubWords(ref.current);
      return () => split.revert();
    },
    { dependencies: [a.signature, text], revertOnUpdate: true },
  );

  return <p ref={ref} className="type-heading text-[clamp(1.5rem,2.9vw,2.625rem)] leading-[1.25]">{text}</p>;
}
