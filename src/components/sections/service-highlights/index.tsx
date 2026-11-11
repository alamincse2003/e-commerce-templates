import { Gift, Globe, HandCoins, RefreshCcw, Ruler, Scissors, ShieldCheck, Truck, type LucideIcon } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations/stagger-container";
import type { SectionOf } from "@/config/schema/site";

const ICONS: Record<SectionOf<"service-highlights">["items"][number]["icon"], LucideIcon> = {
  truck: Truck,
  exchange: RefreshCcw,
  cod: HandCoins,
  secure: ShieldCheck,
  craft: Scissors,
  tailor: Ruler,
  gift: Gift,
  globe: Globe,
};

/** Service promises strip (delivery, exchange, COD…). Builds trust right under the hero. */
export function ServiceHighlights({ section }: { section: SectionOf<"service-highlights"> }) {
  return (
    <section id={section.id} aria-label="Our services" className="border-b border-border">
      <StaggerContainer as="ul" className="container-theme grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4 lg:py-12">
        {section.items.map((item) => {
          const Icon = ICONS[item.icon];
          return (
            <StaggerItem as="li" key={item.title} className="flex gap-4">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.25} aria-hidden />
              <div>
                <p className="t-small font-medium">{item.title}</p>
                <p className="t-small mt-1 text-muted-foreground">{item.text}</p>
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </section>
  );
}
