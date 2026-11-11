import { photo, PHOTO } from "../_demo/media";
import { defineSite } from "../types";

/** Streetwear sample: the rail leads, louder copy, fewer editorial sections. */
export default defineSite({
  brand: {
    name: "Afterhours",
    wordmark: "Afterhours",
    tagline: "Made for the night shift.",
    description: "Heavyweight basics and limited graphics, dropped in numbered runs. No restocks.",
  },
  seo: { title: "Afterhours — Drop 09", description: "Heavyweight basics and limited graphics. No restocks." },
  commerce: { currency: "EUR", locale: "en-IE", freeShippingThreshold: 150 },
  announcement: { enabled: true, messages: ["Drop 09 live now", "No restocks", "Free shipping over €150"] },
  navigation: {
    primary: [
      { label: "Drop", href: "#the-drop" },
      { label: "Fits", href: "#shop-the-look" },
      { label: "Try on", href: "#fitting-room" },
      { label: "Shop", href: "#new-arrivals" },
    ],
    footer: [
      { title: "Shop", links: [{ label: "All", href: "#new-arrivals" }, { label: "Drop 09", href: "#the-drop" }] },
      { title: "Info", links: [{ label: "Shipping", href: "#newsletter" }, { label: "Contact", href: "mailto:help@afterhours.example" }] },
    ],
  },
  social: [{ label: "Instagram", href: "https://instagram.com" }, { label: "TikTok", href: "https://tiktok.com" }],
  contact: { email: "help@afterhours.example", address: "Dublin, Ireland" },
  features: { previewPanel: true, threeD: true },
  homepage: {
    sections: [
      { id: "the-drop", type: "clothing-rail", eyebrow: "Drop 09", title: "Limited Run", productIds: ["rail-logo-tee", "rail-arch-hoodie", "rail-longsleeve", "rail-varsity", "rail-washed-tee", "rail-zip-hoodie", "rail-coach", "rail-white-tee", "rail-burgundy-hoodie", "rail-black-longsleeve"], ticker: ["Limited run", "No restocks", "Afterhours", "Drop 09"], tickerTone: "accent", cta: "See availability" },
      { id: "lookbook", type: "lookbook-hero", eyebrow: "Lookbook", title: "After Dark", description: "Ten fits shot between midnight and six.", lookIds: ["look-17", "look-15", "look-14", "look-16", "look-13"] },
      { id: "shop-the-look", type: "shop-the-look", eyebrow: "Fits", title: "Cop the fit", lookIds: ["look-03", "look-01"] },
      { id: "fitting-room", type: "fitting-room", title: "Try on", word: "FIT", background: photo(PHOTO.rackStudio, "Clothing rack in a studio"), categories: [{ label: "Tees", productIds: ["jersey-tee", "heavyweight-tee", "loopback-sweat"] }, { label: "Jackets", productIds: ["black-suit", "field-jacket", "soft-blazer"] }] },
      { id: "new-arrivals", type: "product-grid", eyebrow: "Shop", title: "Everything", layout: "uniform", productIds: ["denim-jacket", "satin-bomber", "black-suit", "heavyweight-tee", "field-jacket", "wool-beanie", "wide-leg-jean", "jersey-tee"] },
      { id: "newsletter", type: "newsletter", eyebrow: "Early access", title: "Get the drop first", description: "Drop alerts 30 minutes before everyone else.", placeholder: "Email", cta: "Notify me" },
    ],
  },
});
