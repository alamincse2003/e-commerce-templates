"use client";

import { usePrice, useSite } from "@/components/providers/site-provider";
import { Button } from "@/components/ui/button";
import { selectSavings, selectSubtotal, useCartStore } from "@/store/cart-store";

export function CartSummary() {
  const price = usePrice();
  const { commerce } = useSite();
  const subtotal = useCartStore(selectSubtotal);
  const savings = useCartStore(selectSavings);
  const total = subtotal - savings;
  const remaining = Math.max(0, commerce.freeShippingThreshold - total);
  const progress = Math.min(1, total / commerce.freeShippingThreshold);

  return (
    <div className="border-t border-border pt-5">
      <div className="mb-5">
        <p className="text-xs text-muted-foreground">
          {remaining > 0 ? `${price(remaining)} away from complimentary shipping` : "You've unlocked complimentary shipping"}
        </p>
        <div className="mt-2 h-px w-full bg-border">
          <div className="h-px bg-foreground transition-[width] duration-700" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd className="tabular-nums">{price(subtotal)}</dd>
        </div>
        {savings > 0 ? (
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Look bundle savings</dt>
            <dd className="tabular-nums">−{price(savings)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-3 text-base">
          <dt>Total</dt>
          <dd className="tabular-nums">{price(total)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">Taxes and shipping calculated at checkout.</p>
      {/* Checkout is UI-only in this template — connect a commerce backend before enabling. */}
      <Button className="mt-5 w-full" size="lg" disabled aria-describedby="checkout-note">
        Checkout
      </Button>
      <p id="checkout-note" className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
        Checkout is not connected in this preview.
      </p>
    </div>
  );
}
