"use client";

import { Minus, Plus } from "lucide-react";
import { ProductThumb } from "@/components/products/product-thumb";
import { usePrice } from "@/components/providers/site-provider";
import { useCartStore, type CartLine } from "@/store/cart-store";

export function CartItem({ line }: { line: CartLine }) {
  const price = usePrice();
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);

  return (
    <li className="flex gap-4 py-5">
      <ProductThumb image={line.image} garment={line.garment} sizes="96px" className="aspect-[4/5] w-24 shrink-0" />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <p className="t-small font-medium">{line.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {line.color} · {line.size}
              {line.bundle ? ` · Look bundle −${Math.round(line.bundle.discount * 100)}%` : ""}
            </p>
          </div>
          <p className="shrink-0 text-sm tabular-nums">{price(line.price * line.quantity)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center rounded-button border border-border">
            <button type="button" className="inline-flex h-8 w-8 items-center justify-center" aria-label={`Decrease quantity of ${line.name}`} onClick={() => setQuantity(line.key, line.quantity - 1)}>
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-xs tabular-nums" aria-live="polite">
              {line.quantity}
            </span>
            <button type="button" className="inline-flex h-8 w-8 items-center justify-center" aria-label={`Increase quantity of ${line.name}`} onClick={() => setQuantity(line.key, line.quantity + 1)}>
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button type="button" onClick={() => remove(line.key)} className="t-small text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
