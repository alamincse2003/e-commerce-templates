import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Garment, ProductImage } from "@/config/schema/catalog";

export type CartLine = {
  key: string;
  productId: string;
  name: string;
  label: string;
  price: number;
  image?: ProductImage;
  garment?: Garment;
  size: string;
  color: string;
  quantity: number;
  /** Set when added via "complete the look" — discount applies to this line. */
  bundle?: { lookId: string; discount: number };
};

export type CartLineInput = Omit<CartLine, "key" | "quantity"> & { quantity?: number };

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  add: (line: CartLineInput, opts?: { open?: boolean }) => void;
  addMany: (lines: CartLineInput[], opts?: { open?: boolean }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
};

const lineKey = (l: CartLineInput) => [l.productId, l.size, l.color, l.bundle?.lookId ?? ""].join("|");

function merge(lines: CartLine[], incoming: CartLineInput[]): CartLine[] {
  const next = [...lines];
  for (const item of incoming) {
    const key = lineKey(item);
    const qty = item.quantity ?? 1;
    const idx = next.findIndex((l) => l.key === key);
    if (idx >= 0) next[idx] = { ...next[idx], quantity: Math.min(next[idx].quantity + qty, 10) };
    else next.push({ ...item, key, quantity: qty });
  }
  return next;
}

/**
 * Client-side cart. This is UI state only — wire `lines` to a commerce backend
 * (Shopify Storefront, Medusa, Commerce Layer…) when checkout is implemented.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      add: (line, opts) => set((s) => ({ lines: merge(s.lines, [line]), isOpen: opts?.open ?? true })),
      addMany: (lines, opts) => set((s) => ({ lines: merge(s.lines, lines), isOpen: opts?.open ?? true })),
      setQuantity: (key, quantity) =>
        set((s) => ({
          lines:
            quantity <= 0
              ? s.lines.filter((l) => l.key !== key)
              : s.lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(quantity, 10) } : l)),
        })),
      remove: (key) => set((s) => ({ lines: s.lines.filter((l) => l.key !== key) })),
      clear: () => set({ lines: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "nidus-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.quantity, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.price * l.quantity, 0);
export const selectSavings = (s: CartState) =>
  s.lines.reduce((n, l) => n + (l.bundle ? l.price * l.quantity * l.bundle.discount : 0), 0);
