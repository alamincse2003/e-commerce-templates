import { getProducts } from "@/clients";
import type { SectionOf } from "@/config/schema/site";
import { Marquee } from "@/components/ui/marquee";
import { RevealText } from "@/components/animations/reveal-text";
import { Rail } from "./rail";

/** "The Drop" — a dark spotlight room with garments hanging on a chrome rail. */
export function ClothingRail({ section }: { section: SectionOf<"clothing-rail"> }) {
  const products = getProducts(section.productIds).filter((p) => p.garment);
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="relative overflow-hidden bg-inverse text-inverse-foreground">
      {/* Spotlight */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[80%] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,color-mix(in_oklab,var(--t-inverse-foreground)_9%,transparent),transparent_70%)]" />
      <div className="container-theme relative pt-20 lg:pt-28">
        <div className="flex flex-col items-center text-center">
          {section.eyebrow ? <p className="t-small opacity-60">{section.eyebrow}</p> : null}
          <RevealText as="h2" id={`${section.id}-title`} className="type-logo split-safe mt-4 text-[clamp(2.5rem,6vw,5.5rem)]">
            {section.title}
          </RevealText>
        </div>
        <Rail products={products} cta={section.cta} />
      </div>
      <Marquee
        items={section.ticker}
        className={
          section.tickerTone === "accent"
            ? "t-label relative bg-accent py-3 text-accent-foreground"
            : "t-label relative border-t border-inverse-foreground/15 py-3.5 text-inverse-foreground/80"
        }
      />
    </section>
  );
}
