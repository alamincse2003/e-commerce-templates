import { photo, PHOTO } from "../_demo/media";
import { defineSite } from "../types";

/** Organic sample: slower storytelling first, softer copy, no rail. */
export default defineSite({
  brand: {
    name: "Terra & Thread",
    wordmark: "Terra & Thread",
    tagline: "Grown, spun and sewn with care.",
    description: "Seasonless clothing in organic cotton, linen and undyed wool, made in small family workshops.",
  },
  seo: { title: "Terra & Thread â€” Seasonless natural clothing", description: "Organic cotton, linen and undyed wool." },
  commerce: { currency: "GBP", locale: "en-GB", freeShippingThreshold: 120 },
  announcement: { enabled: true, messages: ["Carbon-neutral delivery", "Repairs for life", "Plastic-free packaging"] },
  navigation: {
    primary: [
      { label: "Lookbook", href: "#lookbook" },
      { label: "Our Story", href: "#story" },
      { label: "Shop the Look", href: "#shop-the-look" },
      { label: "Shop", href: "#new-arrivals" },
    ],
    footer: [
      { title: "Shop", links: [{ label: "New in", href: "#new-arrivals" }, { label: "Knitwear", href: "#collections" }] },
      { title: "About", links: [{ label: "Our story", href: "#story" }, { label: "Contact", href: "mailto:hello@terra.example" }] },
    ],
  },
  social: [{ label: "Instagram", href: "https://instagram.com" }, { label: "Pinterest", href: "https://pinterest.com" }],
  contact: { email: "hello@terra.example", address: "Bristol, United Kingdom" },
  features: { previewPanel: true, threeD: true },
  homepage: {
    sections: [
      { id: "lookbook", type: "lookbook-hero", eyebrow: "Seasonless", title: "Of the Earth", description: "Natural fibres, natural dyes, made to soften with every wear.", lookIds: ["look-16", "look-13", "look-14", "look-15"] },
      { id: "the-house", type: "brand-statement", eyebrow: "Our promise", statement: "Every fibre is traceable to the farm it was grown on, every garment repairable for life.", stats: [{ value: "100%", label: "Organic or recycled" }, { value: "6", label: "Family workshops" }, { value: "âˆž", label: "Free repairs" }] },
      { id: "story", type: "editorial-story", eyebrow: "Our Story", title: "Field to wardrobe", intro: "Follow a single garment from seed to stitch.", chapters: [{ numeral: "I", title: "Grow", body: "Rain-fed organic cotton and Normandy flax.", image: photo(PHOTO.knitFlatlay, "Folded knits") }, { numeral: "II", title: "Spin", body: "Spun and woven within 200km of the field.", image: photo(PHOTO.hangersKnits, "Knits on hangers") }, { numeral: "III", title: "Sew", body: "Cut and sewn by six family workshops.", image: photo(PHOTO.rackKnits, "Rack of knitwear") }], outro: { title: "Meet the makers", cta: { label: "Read the journal", href: "#newsletter" } } },
      { id: "shop-the-look", type: "shop-the-look", eyebrow: "Shop the look", title: "Complete the look", lookIds: ["look-02", "look-03", "look-01"] },
      { id: "collections", type: "collections-ring", eyebrow: "Collections", title: "The Seasons", description: "Drag to explore our chapters.", collectionSlugs: ["knitwear", "outerwear", "essentials", "denim", "tailoring", "archive"] },
      { id: "new-arrivals", type: "product-grid", eyebrow: "New in", title: "Freshly made", layout: "asymmetric", productIds: ["crochet-poncho", "silk-shirt-dress", "intarsia-knit", "ribbed-midi", "field-jacket", "wool-beanie", "corduroy-dress", "utility-jumpsuit", "camel-overcoat"] },
      { id: "reviews", type: "testimonials", title: "Kind words", items: [{ quote: "Softest linen I've ever worn â€” and it keeps getting softer.", name: "Hannah P.", location: "Bath" }, { quote: "Sent my jumper back for a free repair after three years. Came back perfect.", name: "Tom W.", location: "Leeds" }] },
      { id: "newsletter", type: "newsletter", eyebrow: "Letters", title: "Seasonal letters", description: "Four letters a year. Workshop visits, new fibres, nothing else.", placeholder: "Your email", cta: "Join" },
    ],
  },
});
