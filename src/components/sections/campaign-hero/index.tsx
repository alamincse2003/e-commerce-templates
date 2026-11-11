import Image from "next/image";
import { FadeIn } from "@/components/animations/fade-in";
import { RevealText } from "@/components/animations/reveal-text";
import { Button } from "@/components/ui/button";
import type { SectionOf } from "@/config/schema/site";
import { cn } from "@/lib/cn";

/**
 * Classic campaign hero: one full-bleed photograph, or a two-panel split (e.g. Women / Men,
 * Saree / Panjabi). Text sits bottom-left on a soft scrim — photography does the talking.
 */
export function CampaignHero({ section }: { section: SectionOf<"campaign-hero"> }) {
  const split = section.panels.length === 2;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="relative isolate">
      <div className={cn("grid h-[calc(100svh-var(--t-header-height)-2.25rem)] min-h-[560px]", split && "md:grid-cols-2")}>
        {section.panels.map((panel, i) => {
          const media = (
            <>
              <Image
                src={panel.image.src}
                alt={panel.image.alt}
                fill
                priority
                sizes={split ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
                className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.02]"
                style={{ objectPosition: panel.image.position ?? "50% 25%" }}
              />
              {panel.label ? (
                <span className="t-small glass absolute top-5 left-5 z-10 px-2.5 py-1 text-foreground">{panel.label}</span>
              ) : null}
            </>
          );
          return panel.href ? (
            <a key={i} href={panel.href} className={cn("group relative overflow-hidden bg-surface", split && i === 1 && "hidden md:block")}>
              {media}
            </a>
          ) : (
            <div key={i} className={cn("group relative overflow-hidden bg-surface", split && i === 1 && "hidden md:block")}>
              {media}
            </div>
          );
        })}
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="container-theme pb-10 text-white lg:pb-14">
          {section.eyebrow ? <p className="t-small mb-4 opacity-85">{section.eyebrow}</p> : null}
          <RevealText as="h1" id={`${section.id}-title`} trigger="load" className={cn("type-display t-hero split-safe", split ? "max-w-[10ch] md:max-w-[min(10ch,44vw)]" : "max-w-[14ch]")}>
            {section.title}
          </RevealText>
          {section.description ? (
            <FadeIn delay={0.3}>
              <p className="t-lead mt-5 max-w-md opacity-90">{section.description}</p>
            </FadeIn>
          ) : null}
          {section.ctas.length ? (
            <FadeIn delay={0.45} className="pointer-events-auto mt-8 flex flex-wrap gap-3">
              {section.ctas.map((cta, i) => (
                <Button key={cta.href + cta.label} href={cta.href} variant={i === 0 ? "inverse" : "outline"} className={i === 0 ? "bg-white text-black" : "border-white text-white hover:bg-white hover:text-black"}>
                  {cta.label}
                </Button>
              ))}
            </FadeIn>
          ) : null}
        </div>
      </div>
    </section>
  );
}
