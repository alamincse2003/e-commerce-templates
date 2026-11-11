import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
    }),
    { name: "nidus-wishlist", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
