"use client";

import Image from "next/image";
import { useState } from "react";
import { useTilt } from "@/animations/use-tilt";
import { usePrice } from "@/components/providers/site-provider";
import type { Product } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { useCartStore } from "@/store/cart-store";
import { toCartLine } from "./to-cart-line";
import { WishlistButton } from "./wishlist-button";

type Props = {
  product: Product;
  sizes: string;
  /** Taller editorial crop for featured tiles. */
  featured?: boolean;
  priority?: boolean;
};

/**
 * Editorial product card: hover swaps to the second image (or zooms the first), and a quick-add
 * size bar slides up. Touch users get the size bar permanently below the image.
 */
export function ProductCard({ product, sizes, featured, priority }: Props) {
  const price = usePrice();
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState<string | null>(null);
  const [primary, secondary] = product.images;
  const tilt = useTilt(featured ? 3 : 5);

  const quickAdd = (size: string) => {
    add(toCartLine(product, { size }));
    setAdded(size);
  };

  return (
    <article className="group/card relative flex h-full flex-col">
      <div
        data-product-media={product.id}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className={cn(
          "relative overflow-hidden rounded-card bg-surface transition-transform duration-300 ease-out [transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))]",
          featured ? "aspect-[4/5] lg:aspect-auto lg:flex-1" : "aspect-[3/4]",
        )}
      >
        <Image
          src={primary.src}
          alt={primary.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-[transform,opacity] duration-700 ease-out",
            secondary ? "group-hover/card:opacity-0" : "group-hover/card:scale-[1.03]",
          )}
          style={{ objectPosition: primary.position }}
        />
        {secondary ? (
          <Image
            src={secondary.src}
            alt=""
            fill
            sizes={sizes}
            className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover/card:opacity-100"
            style={{ objectPosition: secondary.position }}
          />
        ) : null}

        {/* Satin sheen that follows the pointer (2.5D light) */}
        {tilt.enabled ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover/card:opacity-100 [background:radial-gradient(circle_at_var(--sx,50%)_var(--sy,30%),rgb(255_255_255/0.55),transparent_55%)]"
          />
        ) : null}

        <div className="absolute inset-x-2 top-2 flex items-start justify-between">
          {product.badge ? <span className="t-small bg-background px-2 py-0.5">{product.badge}</span> : <span />}
          <WishlistButton productId={product.id} name={product.name} className="glass h-8 w-8 border" />
        </div>

        {/* Quick add (hover on pointer devices) */}
        <div className="glass absolute inset-x-2 bottom-2 hidden translate-y-[calc(100%+0.5rem)] p-3 transition-transform duration-300 ease-out group-focus-within/card:translate-y-0 group-hover/card:translate-y-0 md:block">
          <p className="t-small text-muted-foreground">{added ? `Added to bag — size ${added}` : "Quick add"}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {product.sizes.map((size) => {
              const soldOut = product.soldOutSizes?.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  disabled={soldOut}
                  data-add-to-bag
                  onClick={() => quickAdd(size)}
                  className="t-small min-w-9 border border-border px-2 py-1 transition-colors hover:border-foreground hover:bg-foreground hover:text-background disabled:line-through disabled:opacity-40"
                  aria-label={`Add ${product.name}, size ${size}, to bag`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="t-small truncate font-medium">{product.name}</h3>
          <p className="t-small mt-0.5 truncate text-muted-foreground">{product.colors.length > 1 ? `${product.colors.length} colours` : product.colors[0].name}</p>
        </div>
        <p className="t-small shrink-0 tabular-nums">
          {product.compareAtPrice ? <span className="mr-2 text-muted-foreground line-through">{price(product.compareAtPrice)}</span> : null}
          {price(product.price)}
        </p>
      </div>
      <button
        type="button"
        data-add-to-bag
        onClick={() => quickAdd(toCartLine(product).size)}
        className="t-small mt-2 self-start underline underline-offset-4 md:hidden"
      >
        Add to bag
      </button>
    </article>
  );
}
