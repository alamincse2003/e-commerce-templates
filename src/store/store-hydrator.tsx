"use client";

import { useEffect } from "react";
import { useCartStore } from "./cart-store";
import { usePreviewStore } from "./preview-store";
import { useWishlistStore } from "./wishlist-store";

/** Rehydrates persisted stores after mount so SSR markup and the first client render match. */
export function StoreHydrator({ preview }: { preview: boolean }) {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
    void useWishlistStore.persist.rehydrate();
    if (preview) void usePreviewStore.persist.rehydrate();
  }, [preview]);
  return null;
}
