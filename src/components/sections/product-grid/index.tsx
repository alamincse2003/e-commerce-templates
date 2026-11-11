import { getProducts } from "@/clients";
import { RevealMedia } from "@/components/animations/reveal-media";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { ProductCard } from "@/components/products/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SectionOf } from "@/config/schema/site";
import { cn } from "@/lib/cn";

/** New arrivals / trending grid. "asymmetric" makes the first piece a 2×2 feature tile. */
export function ProductGrid({ section }: { section: SectionOf<"product-grid"> }) {
  const products = getProducts(section.productIds);
  const asymmetric = section.layout === "asymmetric";
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="section-y">
      <div className="container-theme">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          titleId={`${section.id}-title`}
          link={section.cta}
        />
        <RevealMedia>
        <StaggerContainer as="ul" className="gap-theme mt-10 grid grid-cols-2 gap-y-10 lg:mt-12 lg:grid-cols-4">
          {products.map((p, i) => {
            const featured = asymmetric && i === 0;
            return (
              <StaggerItem as="li" key={p.id} className={cn(featured && "col-span-2 lg:row-span-2")}>
                <ProductCard
                  product={p}
                  featured={featured}
                  sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>
        </RevealMedia>
      </div>
    </section>
  );
}
