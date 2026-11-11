"use client";

import { motion } from "motion/react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { fadeUpVariants, staggerVariants } from "@/animations/motion-variants";

type Props = { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "ul" };

/** Parent that staggers its <StaggerItem> children into view. */
export function StaggerContainer({ children, className, delay = 0, as = "div" }: Props) {
  const a = useAnimationConfig();
  const Comp = as === "ul" ? motion.ul : motion.div;
  return (
    <Comp
      className={className}
      variants={staggerVariants(a, delay)}
      initial="hidden"
      whileInView={a.enabled ? "visible" : undefined}
      animate={a.enabled ? undefined : "visible"}
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: { children: React.ReactNode; className?: string; as?: "div" | "li" }) {
  const a = useAnimationConfig();
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp className={className} variants={fadeUpVariants(a)}>
      {children}
    </Comp>
  );
}
