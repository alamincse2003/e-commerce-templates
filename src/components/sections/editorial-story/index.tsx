import type { SectionOf } from "@/config/schema/site";
import { HorizontalStory } from "./horizontal-story";

export function EditorialStory({ section }: { section: SectionOf<"editorial-story"> }) {
  return (
    <HorizontalStory
      id={section.id}
      eyebrow={section.eyebrow}
      title={section.title}
      intro={section.intro}
      chapters={section.chapters}
      outro={section.outro}
      pinned={section.pinned ?? true}
    />
  );
}
