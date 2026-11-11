import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { getCollections } from "@/clients";
import { RevealMedia } from "@/components/animations/reveal-media";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import { SectionHeading } from "@/components/ui/section-heading";
import type { SectionOf } from "@/config/schema/site";
import { cn } from "@/lib/cn";

/** "Shop by category" — uniform portrait tiles with the label underneath. */
export function CategoryGrid({ section }: { section: SectionOf<"category-grid"> }) {
  const collections = getCollections(section.collectionSlugs);
  const cols = collections.length >= 5 ? "lg:grid-cols-5" : collections.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="section-y">
      <div className="container-theme">
        <SectionHeading title={section.title} eyebrow={section.eyebrow} link={section.cta} titleId={`${section.id}-title`} />
        <RevealMedia>
        <StaggerContainer as="ul" className={cn("gap-theme mt-10 grid grid-cols-2 gap-y-8 lg:mt-12", cols)}>
          {collections.map((c) => (
            <StaggerItem as="li" key={c.slug}>
              <a href={c.href} className="group block">
                <div data-collection-media className="relative aspect-[3/4] overflow-hidden rounded-card bg-surface">
                  <Image
                    src={c.image.src}
                    alt={c.image.alt}
                    fill
                    sizes="(min-width: 1024px) 20vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    style={{ objectPosition: c.image.position ?? "50% 30%" }}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="type-heading t-h2">{c.title}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.4} />
                </div>
                <p className="t-small mt-0.5 text-muted-foreground">{c.description}</p>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>
        </RevealMedia>
      </div>
    </section>
  );
}
