"use client";

import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, useGSAP } from "@/animations/gsap-utils";
import { splitReveal } from "@/animations/scroll-animations";

type Props = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  children: string;
  className?: string;
  delay?: number;
  /** "load" plays immediately (above the fold); "scroll" waits for the viewport. */
  trigger?: "scroll" | "load";
  split?: "lines" | "words" | "chars";
  id?: string;
};

/** GSAP SplitText reveal through line masks. Text is real, selectable, and screen-reader friendly. */
export function RevealText({ as = "h2", children, className, delay = 0, trigger = "scroll", split, id }: Props) {
  const ref = useRef<HTMLElement>(null);
  const a = useAnimationConfig();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (!a.enabled) {
        gsap.set(el, { visibility: "visible" });
        return;
      }
      const s = splitReveal(el, a, { split, delay, onScroll: trigger === "scroll" });
      return () => s.revert();
    },
    { dependencies: [a.signature, children, split, delay, trigger], revertOnUpdate: true },
  );

  const Tag = as as React.ElementType;
  return (
    <Tag ref={ref} id={id} data-reveal="text" className={className}>
      {children}
    </Tag>
  );
}
