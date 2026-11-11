"use client";

import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useAnimationConfig } from "@/animations/animation-provider";
import { toCartLine } from "@/components/products/to-cart-line";
import { WishlistButton } from "@/components/products/wishlist-button";
import { usePrice } from "@/components/providers/site-provider";
import { useCartStore } from "@/store/cart-store";
import type { RunwayLook } from "./lookbook-runway";

/** Right-hand product column for the active look (a horizontal strip on mobile). */
export function RunwayProducts({ look }: { look: RunwayLook }) {
  const a = useAnimationConfig();
  const price = usePrice();
  const add = useCartStore((s) => s.add);
  const t = (i: number) => (a.enabled ? { duration: a.duration * 0.6, ease: a.ease.css, delay: i * a.stagger } : { duration: 0 });

  return (
    <div>
      <p className="t-small hidden border-b border-border pb-4 font-medium lg:block">In this look</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={look.id}
          className="no-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0"
          exit={{ opacity: 0, transition: { duration: a.enabled ? 0.25 : 0 } }}
        >
          {look.products.map((p, i) => (
            <motion.li
              key={p.id}
              className="w-[46vw] max-w-[220px] shrink-0 snap-start border-border lg:w-auto lg:max-w-none lg:border-b lg:py-5"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={t(i)}
            >
              <div className="relative flex gap-4 lg:items-center">
                <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-card bg-muted lg:w-24">
                  {p.images[0] ? (
                    <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width: 1024px) 96px, 46vw" className="object-cover" style={{ objectPosition: p.images[0].position }} />
                  ) : null}
                  <WishlistButton productId={p.id} name={p.name} className="absolute top-1 left-1 h-8 w-8 bg-background/70 backdrop-blur lg:hidden" />
                </div>
                <div className="hidden min-w-0 flex-1 lg:block">
                  <p className="t-small font-medium">{p.name}</p>
                  <p className="t-small mt-0.5 tabular-nums text-muted-foreground">{price(p.price)}</p>
                </div>
                <div className="hidden flex-col items-center gap-1 lg:flex">
                  <WishlistButton productId={p.id} name={p.name} />
                  <button type="button" onClick={() => add(toCartLine(p))} aria-label={`Add ${p.name} to bag`} className="inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-foreground hover:text-background">
                    <Plus className="h-4 w-4" strokeWidth={1.4} />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-start justify-between gap-2 lg:hidden">
                <div className="min-w-0">
                  <p className="truncate text-sm">{p.name}</p>
                  <p className="text-xs tabular-nums text-muted-foreground">{price(p.price)}</p>
                </div>
                <button type="button" onClick={() => add(toCartLine(p))} aria-label={`Add ${p.name} to bag`} className="-mr-1 inline-flex h-8 w-8 items-center justify-center">
                  <Plus className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
