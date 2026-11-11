import { RevealText } from "@/components/animations/reveal-text";
import type { SectionOf } from "@/config/schema/site";
import { NewsletterForm } from "./newsletter-form";

export function Newsletter({ section }: { section: SectionOf<"newsletter"> }) {
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="section-y bg-surface">
      <div className="container-theme grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          {section.eyebrow ? <p className="t-small mb-3 text-muted-foreground">{section.eyebrow}</p> : null}
          <RevealText as="h2" id={`${section.id}-title`} className="type-heading t-h1 split-safe">
            {section.title}
          </RevealText>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="t-body max-w-md text-muted-foreground">{section.description}</p>
          <NewsletterForm placeholder={section.placeholder} cta={section.cta} endpoint={section.endpoint} />
        </div>
      </div>
    </section>
  );
}
