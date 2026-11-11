"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { useScrollControl } from "@/animations/lenis-provider";
import { uiTransition } from "@/animations/motion-variants";
import { Button } from "@/components/ui/button";
import { selectCount, useCartStore } from "@/store/cart-store";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

/** Slide-in bag (Motion). Locks page scroll, traps Escape, restores focus on close. */
export function CartDrawer() {
  const a = useAnimationConfig();
  const { lock } = useScrollControl();
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const count = useCartStore(selectCount);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    lock(true);
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      lock(false);
      window.removeEventListener("keydown", onKey);
      returnFocus.current?.focus();
    };
  }, [isOpen, lock, close]);

  const t = uiTransition(a);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[80]">
          <motion.div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={t} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            tabIndex={-1}
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background px-6 shadow-theme outline-none sm:px-8"
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={t}
          >
            <div className="h-header flex shrink-0 items-center justify-between border-b border-border">
              <p className="t-small font-medium">Shopping bag ({count})</p>
              <button type="button" onClick={close} aria-label="Close bag" className="-mr-2 inline-flex h-10 w-10 items-center justify-center">
                <X className="h-5 w-5" strokeWidth={1.4} />
              </button>
            </div>
            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <p className="type-heading t-h2">Your bag is empty</p>
                <p className="mt-3 max-w-xs text-sm text-muted-foreground">Pieces you add will wait for you here.</p>
                <Button className="mt-8" href="#new-arrivals" onClick={close}>
                  Discover new arrivals
                </Button>
              </div>
            ) : (
              <>
                <ul className="-mr-4 flex-1 divide-y divide-border overflow-y-auto pr-4">
                  {lines.map((line) => (
                    <CartItem key={line.key} line={line} />
                  ))}
                </ul>
                <div className="shrink-0 pb-6">
                  <CartSummary />
                </div>
              </>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
