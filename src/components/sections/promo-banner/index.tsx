import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";
import { ParallaxImage } from "@/components/animations/parallax-image";
import { RevealText } from "@/components/animations/reveal-text";
import { Button } from "@/components/ui/button";
import type { SectionOf } from "@/config/schema/site";

export function PromoBanner({ section }: { section: SectionOf<"promo-banner"> }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="relative isolate flex min-h-[78svh] items-end overflow-hidden text-white">
      <ParallaxImage image={section.image} sizes="100vw" intensity={1.2} className="absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
      <div className="container-theme grid gap-10 pb-16 lg:grid-cols-12 lg:items-end lg:pb-24">
        <div className="lg:col-span-8">
          {section.eyebrow ? <p className="t-small opacity-90">{section.eyebrow}</p> : null}
          <RevealText as="h2" id={`${section.id}-title`} className="type-display t-hero split-safe mt-4 max-w-[12ch]">
            {section.title}
          </RevealText>
        </div>
        <FadeIn className="lg:col-span-4" delay={0.2}>
          <p className="t-body max-w-sm opacity-90">{section.description}</p>
          <Button href={section.cta.href} variant="inverse" className="mt-7 bg-white text-black">
            {section.cta.label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" strokeWidth={1.4} />
          </Button>
        </FadeIn>
      </div>
    </section>
  );
}
