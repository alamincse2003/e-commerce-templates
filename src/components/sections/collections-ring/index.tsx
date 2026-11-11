import { getCollections } from "@/clients";
import type { SectionOf } from "@/config/schema/site";
import { CollectionsRingClient } from "./collections-ring";

export function CollectionsRing({ section, threeD }: { section: SectionOf<"collections-ring">; threeD: boolean }) {
  const collections = getCollections(section.collectionSlugs);
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="section-y relative overflow-hidden">
      <CollectionsRingClient
        titleId={`${section.id}-title`}
        eyebrow={section.eyebrow}
        title={section.title}
        description={section.description}
        collections={collections}
        threeD={threeD}
      />
    </section>
  );
}
