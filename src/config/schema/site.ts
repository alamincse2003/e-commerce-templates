import { z } from "zod";
import { imageSchema } from "./catalog";

const link = z.object({ label: z.string(), href: z.string() });

/** Every homepage section shares an anchor id, an on/off switch and an optional small kicker. */
const base = { id: z.string(), enabled: z.boolean().optional(), eyebrow: z.string().optional() };

export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    ...base,
    type: z.literal("lookbook-hero"),
    title: z.string(),
    description: z.string(),
    lookIds: z.array(z.string()).min(2),
  }),
  z.object({
    ...base,
    type: z.literal("campaign-hero"),
    title: z.string(),
    description: z.string().optional(),
    /** One full-bleed image, or two side by side (e.g. Women / Men). */
    panels: z
      .array(z.object({ image: imageSchema, label: z.string().optional(), href: z.string().optional() }))
      .min(1)
      .max(2),
    ctas: z.array(link).max(2),
  }),
  z.object({
    ...base,
    type: z.literal("service-highlights"),
    items: z
      .array(
        z.object({
          icon: z.enum(["truck", "exchange", "cod", "secure", "craft", "tailor", "gift", "globe"]),
          title: z.string(),
          text: z.string(),
        }),
      )
      .min(2)
      .max(4),
  }),
  z.object({
    ...base,
    type: z.literal("category-grid"),
    title: z.string(),
    collectionSlugs: z.array(z.string()).min(2).max(6),
    cta: link.optional(),
  }),
  z.object({
    ...base,
    type: z.literal("brand-statement"),
    statement: z.string(),
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
  }),
  z.object({
    ...base,
    type: z.literal("clothing-rail"),
    title: z.string(),
    productIds: z.array(z.string()).min(3),
    ticker: z.array(z.string()).min(1),
    /** "accent" paints the ticker in the theme accent (great for streetwear); "neutral" stays monochrome. */
    tickerTone: z.enum(["accent", "neutral"]).optional(),
    cta: z.string(),
  }),
  z.object({
    ...base,
    type: z.literal("shop-the-look"),
    title: z.string(),
    lookIds: z.array(z.string()).min(1),
  }),
  z.object({
    ...base,
    type: z.literal("collections-ring"),
    title: z.string(),
    description: z.string(),
    collectionSlugs: z.array(z.string()).min(4),
  }),
  z.object({
    ...base,
    type: z.literal("editorial-story"),
    title: z.string(),
    intro: z.string(),
    chapters: z
      .array(z.object({ numeral: z.string(), title: z.string(), body: z.string(), image: imageSchema }))
      .min(2),
    outro: z.object({ title: z.string(), cta: link }),
  }),
  z.object({
    ...base,
    type: z.literal("fitting-room"),
    title: z.string(),
    word: z.string(),
    /** Optional room photo behind the mirror. Without it the section uses the theme surface. */
    background: imageSchema.optional(),
    categories: z.array(z.object({ label: z.string(), productIds: z.array(z.string()).min(2) })).min(1),
  }),
  z.object({
    ...base,
    type: z.literal("product-grid"),
    title: z.string(),
    productIds: z.array(z.string()).min(1),
    layout: z.enum(["asymmetric", "uniform"]),
    cta: link.optional(),
  }),
  z.object({
    ...base,
    type: z.literal("promo-banner"),
    title: z.string(),
    description: z.string(),
    image: imageSchema,
    cta: link,
  }),
  z.object({
    ...base,
    type: z.literal("testimonials"),
    title: z.string(),
    items: z
      .array(
        z.object({
          quote: z.string(),
          name: z.string(),
          location: z.string(),
          rating: z.number().min(1).max(5).optional(),
          productId: z.string().optional(),
        }),
      )
      .min(1),
  }),
  z.object({
    ...base,
    type: z.literal("newsletter"),
    title: z.string(),
    description: z.string(),
    placeholder: z.string(),
    cta: z.string(),
    /** POST endpoint for real subscriptions. Leave empty to run the UI in demo mode. */
    endpoint: z.string().optional(),
  }),
]);

export const siteConfigSchema = z.object({
  brand: z.object({
    name: z.string(),
    /** Text wordmark rendered in the theme's logo font. */
    wordmark: z.string(),
    tagline: z.string(),
    /** Optional secondary-language line (e.g. Bangla) shown in the footer. */
    localTagline: z.string().optional(),
    description: z.string(),
    /** Optional image logo (overrides the wordmark in the header). */
    logo: z.object({ src: z.string(), alt: z.string(), width: z.number(), height: z.number() }).optional(),
    favicon: z.string().optional(),
  }),
  seo: z.object({ title: z.string(), description: z.string() }),
  /** `lang` attribute of the document — "en", "bn", … */
  locale: z.string().optional(),
  commerce: z.object({
    currency: z.string().length(3),
    locale: z.string(),
    freeShippingThreshold: z.number().nonnegative(),
    /** Accepted payment methods shown as badges in the footer (e.g. "bKash", "Visa", "Cash on delivery"). */
    payments: z.array(z.string()).optional(),
  }),
  announcement: z.object({ enabled: z.boolean(), messages: z.array(z.string()).min(1) }),
  navigation: z.object({
    primary: z.array(link).min(1),
    footer: z.array(z.object({ title: z.string(), links: z.array(link) })),
  }),
  social: z.array(link),
  contact: z.object({ email: z.string(), phone: z.string().optional(), address: z.string() }),
  features: z.object({
    /** Live theme/animation panel for demos. Also gated by NEXT_PUBLIC_PREVIEW_PANEL. */
    previewPanel: z.boolean(),
    /** Allow the WebGL collections ring (falls back to a static grid when false). */
    threeD: z.boolean(),
  }),
  homepage: z.object({ sections: z.array(sectionSchema).min(1) }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type SectionConfig = z.infer<typeof sectionSchema>;
export type SectionOf<T extends SectionConfig["type"]> = Extract<SectionConfig, { type: T }>;
