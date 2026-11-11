import type { SectionOf } from "@/config/schema/site";
import { readableOn } from "@/lib/color";
import { IntroHeroClient } from "./intro-hero";

export function IntroHero({ section, first }: { section: SectionOf<"intro-hero">; first: boolean }) {
  return (
    <IntroHeroClient
      id={section.id}
      introTitle={section.introTitle}
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
      images={section.images}
      ctas={section.ctas}
      stageColor={section.stageColor}
      stageText={section.stageColor ? readableOn(section.stageColor, "#FFFFFF", "#1C1A24") : undefined}
      headingLevel={first ? "h1" : "h2"}
    />
  );
}
