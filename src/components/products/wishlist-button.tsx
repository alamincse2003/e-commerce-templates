"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/cn";
import { useWishlistStore } from "@/store/wishlist-store";

export function WishlistButton({ productId, name, className }: { productId: string; name: string; className?: string }) {
  const active = useWishlistStore((s) => s.ids.includes(productId));
  const toggle = useWishlistStore((s) => s.toggle);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={active ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      className={cn("inline-flex h-9 w-9 items-center justify-center rounded-full", className)}
    >
      <Heart className={cn("h-4 w-4 transition-colors", active && "fill-current")} strokeWidth={1.5} />
    </motion.button>
  );
}
