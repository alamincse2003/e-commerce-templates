"use client";

import { ArrowRight, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useAnimationConfig } from "@/animations/animation-provider";
import { toCartLine } from "@/components/products/to-cart-line";
import { usePrice } from "@/components/providers/site-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart-store";
import type { ShoppableLook } from "./look-viewer";

type Props = { look: ShoppableLook; activeItem: number | null; onActiveItem: (i: number | null) => void };

export function LookItems({ look, activeItem, onActiveItem }: Props) {
  const a = useAnimationConfig();
  const price = usePrice();
  const add = useCartStore((s) => s.add);
  const addMany = useCartStore((s) => s.addMany);

  const total = look.items.reduce((n, i) => n + i.product.price, 0);
  const bundled = total * (1 - look.bundleDiscount);
  const pct = Math.round(look.bundleDiscount * 100);

  const addLook = () =>
    addMany(look.items.map((i) => toCartLine(i.product, { bundle: { lookId: look.id, discount: look.bundleDiscount } })));

  return (
    <div className="lg:sticky lg:top-[calc(var(--t-header-height)+2rem)]">
      <p className="t-small border-b border-border pb-4 font-medium">In this look</p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={look.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={a.enabled ? { duration: 0.35, ease: a.ease.css } : { duration: 0 }}
        >
          {look.items.map(({ product }, i) => (
            <li
              key={product.id}
              onMouseEnter={() => onActiveItem(i)}
              onMouseLeave={() => onActiveItem(null)}
              className={cn("flex items-center gap-5 border-b border-border px-2 py-5 transition-colors duration-300", activeItem === i && "bg-background")}
            >
              <div className="relative">
                <div className="relative aspect-[4/5] w-20 overflow-hidden rounded-card bg-muted">
                  {product.images[0] ? <Image src={product.images[0].src} alt={product.images[0].alt} fill sizes="80px" className="object-cover" /> : null}
                </div>
                <span className={cn("absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[0.625rem] tabular-nums transition-colors", activeItem === i ? "bg-foreground text-background" : "bg-background text-foreground ring-1 ring-border")}>
                  {i + 1}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="t-small font-medium">{product.name}</p>
                <p className="t-small mt-0.5 tabular-nums text-muted-foreground">{price(product.price)}</p>
              </div>
              <button
                type="button"
                onClick={() => add(toCartLine(product))}
                onFocus={() => onActiveItem(i)}
                onBlur={() => onActiveItem(null)}
                aria-label={`Add ${product.name} to bag`}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-foreground hover:text-background"
              >
                <Plus className="h-4 w-4" strokeWidth={1.4} />
              </button>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>

      <div className="mt-8 rounded-card bg-background p-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm">Complete the look</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Bundle all {look.items.length} and save {pct}%
            </p>
          </div>
          <p className="text-right tabular-nums">
            <span className="mr-2 text-xs text-muted-foreground line-through">{price(total)}</span>
            <span className="t-body font-medium">{price(Math.round(bundled * 100) / 100)}</span>
          </p>
        </div>
        <Button onClick={addLook} className="mt-5 w-full justify-between" size="lg">
          Add full look to bag
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" strokeWidth={1.4} />
        </Button>
      </div>
    </div>
  );
}
