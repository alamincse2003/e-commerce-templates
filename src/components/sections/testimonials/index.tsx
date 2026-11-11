import { Star } from "lucide-react";
import Image from "next/image";
import { getProduct } from "@/clients";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SectionOf } from "@/config/schema/site";

/** Customer reviews as a calm three-up grid — readable at a glance, no carousel to chase. */
export function Testimonials({ section }: { section: SectionOf<"testimonials"> }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="section-y border-t border-border">
      <div className="container-theme">
        <SectionHeading title={section.title} eyebrow={section.eyebrow} titleId={`${section.id}-title`} />
        <StaggerContainer as="ul" className="mt-10 grid gap-px bg-border md:grid-cols-3 lg:mt-12">
          {section.items.slice(0, 3).map((t) => {
            const product = t.productId ? getProduct(t.productId) : undefined;
            const rating = t.rating ?? 5;
            return (
              <StaggerItem as="li" key={t.name} className="flex flex-col bg-background p-6 lg:p-8">
                <div className="flex gap-0.5" role="img" aria-label={`Rated ${rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={i < rating ? "h-3.5 w-3.5 fill-current" : "h-3.5 w-3.5 opacity-25"} strokeWidth={1.2} />
                  ))}
                </div>
                <blockquote className="t-body mt-5 flex-1 leading-relaxed">“{t.quote}”</blockquote>
                <div className="mt-8 flex items-center gap-3">
                  {product?.images[0] ? (
                    <span className="relative h-12 w-10 shrink-0 overflow-hidden bg-surface">
                      <Image src={product.images[0].src} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                  ) : null}
                  <div className="min-w-0">
                    <p className="t-small font-medium">
                      {t.name} <span className="font-normal text-muted-foreground">· {t.location}</span>
                    </p>
                    {product ? <p className="t-small truncate text-muted-foreground">Bought: {product.name}</p> : null}
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
