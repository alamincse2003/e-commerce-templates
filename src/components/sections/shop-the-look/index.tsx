import { getLooks, getProduct } from "@/clients";
import type { SectionOf } from "@/config/schema/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { LookViewer, type ShoppableLook } from "./look-viewer";

export function ShopTheLook({ section }: { section: SectionOf<"shop-the-look"> }) {
  const looks: ShoppableLook[] = getLooks(section.lookIds).map((look) => ({
    id: look.id,
    number: look.number,
    title: look.title,
    image: look.image,
    bundleDiscount: look.bundleDiscount,
    items: look.items.map((item) => ({ product: getProduct(item.productId), hotspot: item.hotspot ?? { x: 50, y: 50 } })),
  }));
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="section-y bg-surface">
      <div className="container-theme">
        <SectionHeading eyebrow={section.eyebrow} title={section.title} titleId={`${section.id}-title`} />
        <LookViewer looks={looks} />
      </div>
    </section>
  );
}
