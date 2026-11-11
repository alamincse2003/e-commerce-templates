import type { SectionConfig } from "@/config/schema/site";
import { BrandStatement } from "./brand-statement";
import { CampaignHero } from "./campaign-hero";
import { CategoryGrid } from "./category-grid";
import { ClothingRail } from "./clothing-rail";
import { CollectionsRing } from "./collections-ring";
import { EditorialStory } from "./editorial-story";
import { FittingRoom } from "./fitting-room";
import { IntroHero } from "./intro-hero";
import { LookbookHero } from "./lookbook-hero";
import { MotifDivider } from "./motif-divider";
import { Newsletter } from "./newsletter";
import { ProductGrid } from "./product-grid";
import { ServiceHighlights } from "./service-highlights";
import { PromoBanner } from "./promo-banner";
import { ShopTheLook } from "./shop-the-look";
import { Testimonials } from "./testimonials";

/** `first` = this section opens the page, so it owns the page <h1>. */
type Ctx = { threeD: boolean; first: boolean; motif?: "kantha" | "floral" | "deco" };

/**
 * Maps a section config to its component. Homepages are composed purely from config —
 * reorder, remove or duplicate sections in the client's site.config.ts.
 */
export function SectionRenderer({ section, ctx }: { section: SectionConfig; ctx: Ctx }) {
  switch (section.type) {
    case "motif-divider":
      return <MotifDivider section={section} brandMotif={ctx.motif} />;
    case "intro-hero":
      return <IntroHero section={section} first={ctx.first} />;
    case "lookbook-hero":
      return <LookbookHero section={section} first={ctx.first} />;
    case "campaign-hero":
      return <CampaignHero section={section} first={ctx.first} />;
    case "service-highlights":
      return <ServiceHighlights section={section} />;
    case "category-grid":
      return <CategoryGrid section={section} />;
    case "brand-statement":
      return <BrandStatement section={section} />;
    case "clothing-rail":
      return <ClothingRail section={section} />;
    case "shop-the-look":
      return <ShopTheLook section={section} />;
    case "collections-ring":
      return <CollectionsRing section={section} threeD={ctx.threeD} />;
    case "editorial-story":
      return <EditorialStory section={section} />;
    case "fitting-room":
      return <FittingRoom section={section} />;
    case "product-grid":
      return <ProductGrid section={section} />;
    case "promo-banner":
      return <PromoBanner section={section} />;
    case "testimonials":
      return <Testimonials section={section} />;
    case "newsletter":
      return <Newsletter section={section} />;
  }
}
