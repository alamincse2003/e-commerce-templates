import { getProducts } from "@/clients";
import type { SectionOf } from "@/config/schema/site";
import { FittingRoomClient } from "./fitting-room";

export function FittingRoom({ section }: { section: SectionOf<"fitting-room"> }) {
  const categories = section.categories.map((c) => ({ label: c.label, products: getProducts(c.productIds) }));
  return <FittingRoomClient id={section.id} title={section.title} eyebrow={section.eyebrow} word={section.word} background={section.background} categories={categories} />;
}
