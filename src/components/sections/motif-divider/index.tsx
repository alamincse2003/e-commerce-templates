import type { SectionOf } from "@/config/schema/site";
import { MotifDividerClient } from "./motif-divider";

/** Section wrapper: uses the section's motif, else the brand motif from site config. */
export function MotifDivider({ section, brandMotif }: { section: SectionOf<"motif-divider">; brandMotif?: "kantha" | "floral" | "deco" }) {
  const motif = section.motif ?? brandMotif ?? "deco";
  return (
    <section id={section.id} aria-label={section.caption ?? "Divider"}>
      <MotifDividerClient motif={motif} caption={section.caption} />
    </section>
  );
}
