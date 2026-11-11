"use client";

import Image from "next/image";
import { useState } from "react";
import { toCartLine } from "@/components/products/to-cart-line";
import { usePrice } from "@/components/providers/site-provider";
import type { Product } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart-store";

/** Selection bar for the tried-on piece. Keyed by product so options reset per piece. */
export function FitBar({ product, className }: { product: Product; className?: string }) {
  return <FitBarInner key={product.id} product={product} className={className} />;
}

function FitBarInner({ product, className }: { product: Product; className?: string }) {
  const price = usePrice();
  const add = useCartStore((s) => s.add);
  const firstAvailable = product.sizes.find((s) => !product.soldOutSizes?.includes(s)) ?? product.sizes[0];
  const [size, setSize] = useState(firstAvailable);
  const [color, setColor] = useState(0);
  const img = product.images[0];

  return (
    <div
      data-product-scope
      className={cn(
        "mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 p-3 pr-3 lg:absolute lg:bottom-8 lg:left-1/2 lg:mt-0 lg:w-max lg:max-w-[calc(100%-4rem)] lg:-translate-x-1/2 lg:flex-nowrap",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-surface">
          {img ? <Image src={img.src} alt="" fill sizes="56px" className="object-cover" style={{ objectPosition: img.position }} /> : null}
        </div>
        <div className="min-w-0">
          <p className="t-small truncate font-medium">{product.name}</p>
          <p className="t-small tabular-nums text-muted-foreground">{price(product.price)}</p>
        </div>
      </div>

      <fieldset>
        <legend className="t-small mb-1.5 text-muted-foreground">Size</legend>
        <div className="flex gap-1.5">
          {product.sizes.map((s) => {
            const soldOut = product.soldOutSizes?.includes(s);
            return (
              <button
                key={s}
                type="button"
                disabled={soldOut}
                onClick={() => setSize(s)}
                aria-pressed={size === s}
                className={cn(
                  "t-small h-8 min-w-9 border px-2 transition-colors disabled:line-through disabled:opacity-35",
                  size === s ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="t-small mb-1.5 text-muted-foreground">Colour · {product.colors[color].name}</legend>
        <div className="flex gap-2">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(i)}
              aria-pressed={color === i}
              aria-label={c.name}
              className={cn("h-6 w-6 rounded-full ring-1 ring-foreground/15 ring-offset-2 ring-offset-background transition-shadow", color === i && "ring-foreground")}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        data-add-to-bag
        onClick={() => add(toCartLine(product, { size, color: product.colors[color].name }))}
        className="t-label ml-auto h-11 rounded-button bg-button px-6 text-button-foreground transition-opacity hover:opacity-85"
      >
        Add to bag
      </button>
    </div>
  );
}
