import { SectionRenderer } from "@/components/sections/section-renderer";
import { siteConfig } from "@/config/site.config";

export default function HomePage() {
  const sections = siteConfig.homepage.sections.filter((s) => s.enabled !== false);
  return (
    <>
      {sections.map((section, i) => (
        <SectionRenderer key={section.id} section={section} ctx={{ threeD: siteConfig.features.threeD, first: i === 0, motif: siteConfig.brand.motif }} />
      ))}
    </>
  );
}
