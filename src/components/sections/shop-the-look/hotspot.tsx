"use client";

import { AnimatePresence, motion } from "motion/react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { cn } from "@/lib/cn";

type Props = {
  index: number;
  x: number;
  y: number;
  name: string;
  active: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
};

export function Hotspot({ index, x, y, name, active, onActivate, onDeactivate }: Props) {
  const a = useAnimationConfig();
  const labelLeft = x > 62; // flip the label when the dot is near the right edge
  return (
    <motion.div
      className="absolute z-10"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={a.enabled ? { delay: 0.35 + index * 0.12, type: "spring", stiffness: 380, damping: 22 } : { duration: 0 }}
    >
      <button
        type="button"
        onClick={onActivate}
        onMouseEnter={onActivate}
        onMouseLeave={onDeactivate}
        onFocus={onActivate}
        onBlur={onDeactivate}
        aria-label={`Piece ${index + 1}: ${name}`}
        aria-expanded={active}
        className="relative -translate-x-1/2 -translate-y-1/2"
      >
        <span aria-hidden className="animate-ping-soft absolute inset-0 rounded-full bg-background/70" />
        <span
          className={cn(
            "relative flex h-7 w-7 items-center justify-center rounded-full text-[0.6875rem] font-medium tabular-nums ring-1 transition-colors duration-300",
            active ? "bg-foreground text-background ring-foreground" : "bg-background text-foreground ring-foreground/10",
          )}
        >
          {index + 1}
        </span>
      </button>
      <AnimatePresence>
        {active ? (
          <motion.span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 -translate-y-1/2 glass whitespace-nowrap px-2.5 py-1 text-[0.75rem]",
              labelLeft ? "right-5" : "left-5",
            )}
            initial={{ opacity: 0, x: labelLeft ? 6 : -6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: a.enabled ? 0.25 : 0 }}
          >
            {name}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
