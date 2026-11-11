"use client";

import { motion } from "motion/react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { fadeUpVariants } from "@/animations/motion-variants";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Fraction of the element that must be visible before it animates. */
  amount?: number;
};

/** Motion-powered entrance. Renders visible immediately when animations are off. */
export function FadeIn({ children, className, delay = 0, amount = 0.25 }: Props) {
  const a = useAnimationConfig();
  return (
    <motion.div
      className={className}
      variants={fadeUpVariants(a, delay)}
      initial="hidden"
      whileInView={a.enabled ? "visible" : undefined}
      animate={a.enabled ? undefined : "visible"}
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}
