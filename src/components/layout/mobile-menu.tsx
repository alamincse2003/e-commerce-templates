"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { useScrollControl } from "@/animations/lenis-provider";
import { uiTransition } from "@/animations/motion-variants";
import { useSite } from "@/components/providers/site-provider";

type Props = { open: boolean; onClose: () => void; links: { label: string; href: string }[]; wordmark: string };

/** Full-screen editorial menu for touch devices. */
export function MobileMenu({ open, onClose, links, wordmark }: Props) {
  const a = useAnimationConfig();
  const { lock } = useScrollControl();
  const { brandName } = useSite();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    lock(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lock(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lock, onClose]);

  const t = uiTransition(a);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-[60] flex flex-col bg-background lg:hidden"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={t}
        >
          <div className="container-theme h-header flex items-center justify-between">
            <span className="type-logo text-2xl">{wordmark}</span>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close menu" className="-mr-2 inline-flex h-10 w-10 items-center justify-center">
              <X className="h-5 w-5" strokeWidth={1.4} />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-theme flex flex-1 flex-col justify-center">
            <ul className="space-y-2">
              {links.map((link, i) => (
                <li key={link.href + link.label} className="overflow-hidden">
                  <motion.a
                    href={link.href}
                    onClick={onClose}
                    className="type-heading block py-2 text-[clamp(2rem,9vw,3rem)]"
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    transition={{ ...t, delay: a.enabled ? 0.12 + i * 0.06 : 0 }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="container-theme t-small pb-8 text-muted-foreground">© {brandName}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
