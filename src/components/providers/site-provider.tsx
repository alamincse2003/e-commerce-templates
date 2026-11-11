"use client";

import { createContext, useContext } from "react";
import { formatPrice, type CommerceSettings } from "@/lib/format";

type SiteContextValue = {
  brandName: string;
  commerce: CommerceSettings & { freeShippingThreshold: number };
};

const SiteContext = createContext<SiteContextValue | null>(null);

/** Small slice of site config that client components need (keeps full config server-side). */
export function SiteProvider({ value, children }: { value: SiteContextValue; children: React.ReactNode }) {
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error("useSite must be used inside <SiteProvider>");
  return ctx;
}

export function usePrice() {
  const { commerce } = useSite();
  return (amount: number) => formatPrice(amount, commerce);
}
