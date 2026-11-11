import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import type { SectionOf } from "@/config/schema/site";
import { ScrubStatement } from "./scrub-statement";

export function BrandStatement({ section }: { section: SectionOf<"brand-statement"> }) {
  return (
    <section id={section.id} aria-label={section.eyebrow ?? "About us"} className="section-y">
      <div className="container-theme grid gap-10 lg:grid-cols-12">
        {section.eyebrow ? <p className="t-small text-muted-foreground lg:col-span-3">{section.eyebrow}</p> : null}
        <div className="lg:col-span-8 lg:col-start-4">
          <ScrubStatement text={section.statement} />
          {section.stats.length ? (
            <StaggerContainer as="ul" className="mt-14 grid grid-cols-3 gap-6 border-t border-border pt-8">
              {section.stats.map((s) => (
                <StaggerItem as="li" key={s.label}>
                  <p className="type-heading t-h1">{s.value}</p>
                  <p className="t-small mt-1 text-muted-foreground">{s.label}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          ) : null}
        </div>
      </div>
    </section>
  );
}
