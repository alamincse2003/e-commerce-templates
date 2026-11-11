export type CommerceSettings = { currency: string; locale: string };

const cache = new Map<string, Intl.NumberFormat>();

export function formatPrice(amount: number, { currency, locale }: CommerceSettings): string {
  const key = `${locale}-${currency}`;
  let fmt = cache.get(key);
  if (!fmt) {
    // narrowSymbol → "৳4,500" / "$120" / "€95" rather than "BDT 4,500".
    fmt = new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0 });
    cache.set(key, fmt);
  }
  return fmt.format(amount);
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
