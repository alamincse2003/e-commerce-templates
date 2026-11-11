import { getLooks, getProducts } from "@/clients";
import type { SectionOf } from "@/config/schema/site";
import { LookbookRunway, type RunwayLook } from "./lookbook-runway";

/** Server wrapper: resolves look + product references, hands plain data to the client runway. */
export function LookbookHero({ section }: { section: SectionOf<"lookbook-hero"> }) {
  const looks: RunwayLook[] = getLooks(section.lookIds).map((look) => ({
    id: look.id,
    number: look.number,
    title: look.title,
    image: look.image,
    bundleDiscount: look.bundleDiscount,
    products: getProducts(look.items.map((i) => i.productId)),
  }));
  return (
    <LookbookRunway id={section.id} eyebrow={section.eyebrow} title={section.title} description={section.description} looks={looks} />
  );
}
