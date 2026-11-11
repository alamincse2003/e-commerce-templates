"use client";

import Image from "next/image";
import { usePrice } from "@/components/providers/site-provider";
import type { Product } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";

type Props = { product: Product; selected: boolean; onTryOn: () => void; className?: string };

/** Product card in the fitting-room carousel. Selecting it "tries it on". */
export function GlassCard({ product, selected, onTryOn, className }: Props) {
  const price = usePrice();
  const img = product.images[0];
  return (
    <button
      type="button"
      onClick={onTryOn}
      aria-pressed={selected}
      aria-label={`Try on ${product.name}, ${price(product.price)}`}
      className={cn("group/card flex w-full flex-col p-2 text-left transition-[border-color] duration-300", selected && "border-foreground", className)}
    >
      <span className="relative block aspect-[4/5] overflow-hidden bg-surface">
        {img ? <Image src={img.src} alt="" fill sizes="200px" className="object-cover" style={{ objectPosition: img.position }} /> : null}
        <span className="t-label absolute inset-x-0 bottom-0 translate-y-full bg-foreground py-2 text-center text-background transition-transform duration-300 group-hover/card:translate-y-0 group-focus-visible/card:translate-y-0">
          {selected ? "Trying on" : "Try on"}
        </span>
      </span>
      <span className="mt-2 flex items-baseline justify-between gap-2 px-0.5">
        <span className="t-small truncate">{product.name}</span>
        <span className="t-small shrink-0 tabular-nums text-muted-foreground">{price(product.price)}</span>
      </span>
    </button>
  );
}
