"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";

/** One calm, centred message at a time — the way premium stores do it (no scrolling ticker). */
export function AnnouncementBar({ messages }: { messages: string[] }) {
  const a = useAnimationConfig();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!a.enabled || messages.length < 2) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % messages.length), 4500);
    return () => window.clearInterval(id);
  }, [a.enabled, messages.length]);

  return (
    <div className="relative z-50 bg-inverse text-inverse-foreground">
      <div className="container-theme flex h-9 items-center justify-center overflow-hidden" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={i}
            className="t-small truncate text-center tracking-[0.02em]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: a.enabled ? 0.35 : 0 }}
          >
            {messages[i]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
