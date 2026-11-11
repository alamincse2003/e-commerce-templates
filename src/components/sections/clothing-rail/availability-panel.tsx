"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { uiTransition } from "@/animations/motion-variants";
import { toCartLine } from "@/components/products/to-cart-line";
import { usePrice } from "@/components/providers/site-provider";
import type { Product } from "@/config/schema/catalog";
import { useCartStore } from "@/store/cart-store";

/** Size availability for the selected limited-run piece (Motion height/opacity transition). */
export function AvailabilityPanel({ open, product, onClose }: { open: boolean; product: Product; onClose: () => void }) {
  const a = useAnimationConfig();
  const price = usePrice();
  const add = useCartStore((s) => s.add);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          key="panel"
          className="w-full max-w-md overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={uiTransition(a)}
        >
          <div className="border border-inverse-foreground/15 p-5" aria-live="polite">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="t-small opacity-60">Availability</p>
                <p className="t-h2 mt-1">{product.name}</p>
                <p className="mt-0.5 text-sm tabular-nums opacity-70">{price(product.price)}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="Close availability" className="-mt-1 -mr-1 inline-flex h-8 w-8 items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="mt-4 grid grid-cols-4 gap-2">
              {product.sizes.map((size) => {
                const soldOut = product.soldOutSizes?.includes(size);
                return (
                  <li key={size}>
                    <button
                      type="button"
                      disabled={soldOut}
                      data-add-to-bag
                      onClick={() => add(toCartLine(product, { size }))}
                      className="t-small w-full border border-inverse-foreground/30 py-2 transition-colors hover:bg-inverse-foreground hover:text-inverse disabled:border-inverse-foreground/10 disabled:line-through disabled:opacity-40"
                      aria-label={soldOut ? `Size ${size} sold out` : `Add size ${size} to bag`}
                    >
                      {size}
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-[0.6875rem] opacity-60">Struck-through sizes are sold out. This run will not be restocked.</p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
