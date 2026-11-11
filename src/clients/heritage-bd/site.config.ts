import { photo, PHOTO } from "../_demo/media";
import { defineSite } from "../types";

/** Bangladeshi heritage sample — BDT, bKash/Nagad/COD, bilingual touches, Eid campaign. */
export default defineSite({
  brand: {
    name: "Bunon",
    wordmark: "Bunon",
    tagline: "Handwoven in Bangladesh.",
    localTagline: "ঐতিহ্যের বুননে আধুনিকতা",
    description: "Panjabi, saree and festive wear woven by artisan families in Tangail, Sirajganj and Dhaka — made to be handed down.",
  },
  seo: { title: "Bunon — Eid Collection 2027", description: "Handwoven panjabi, saree and festive wear from Bangladesh. Delivery across Bangladesh and worldwide." },
  locale: "en",
  commerce: {
    currency: "BDT",
    locale: "en-BD",
    freeShippingThreshold: 3000,
    payments: ["bKash", "Nagad", "Visa", "Mastercard", "Cash on delivery"],
  },
  announcement: {
    enabled: true,
    messages: ["Free delivery inside Dhaka on orders over ৳3,000", "ঈদ কালেকশন ২০২৭ — এখন পাওয়া যাচ্ছে", "Cash on delivery available across Bangladesh"],
  },
  navigation: {
    primary: [
      { label: "Eid 2027", href: "#new-arrivals" },
      { label: "Panjabi", href: "#categories" },
      { label: "Saree", href: "#categories" },
      { label: "Wedding", href: "#wedding" },
      { label: "Our Story", href: "#the-house" },
    ],
    footer: [
      { title: "Shop", links: [{ label: "Eid collection", href: "#new-arrivals" }, { label: "Panjabi", href: "#categories" }, { label: "Saree", href: "#categories" }, { label: "Wedding", href: "#wedding" }] },
      { title: "Help", links: [{ label: "Delivery & returns", href: "#services" }, { label: "Size guide", href: "#fitting-room" }, { label: "Track order", href: "#services" }] },
      { title: "Bunon", links: [{ label: "Our artisans", href: "#the-house" }, { label: "Stores", href: "#the-house" }, { label: "Contact", href: "mailto:hello@bunon.example" }] },
    ],
  },
  social: [
    { label: "Facebook", href: "https://facebook.com" },
    { label: "Instagram", href: "https://instagram.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
  contact: { email: "hello@bunon.example", phone: "+880 1700 000 000", address: "House 12, Road 27, Gulshan 1, Dhaka" },
  features: { previewPanel: true, threeD: false },
  homepage: {
    sections: [
      {
        id: "eid",
        type: "campaign-hero",
        eyebrow: "ঈদ কালেকশন ২০২৭",
        title: "The Eid Collection",
        description: "Handloom silk, fine cotton and hand embroidery — festive pieces woven to be handed down.",
        panels: [
          { image: photo(PHOTO.silkSaree, "Woman in a magenta silk saree", "50% 20%"), label: "Women", href: "#new-arrivals" },
          { image: photo(PHOTO.lilacKoti, "Man in a lilac panjabi and brocade koti", "50% 20%"), label: "Men", href: "#fitting-room" },
        ],
        ctas: [
          { label: "Shop women", href: "#new-arrivals" },
          { label: "Shop men", href: "#fitting-room" },
        ],
      },
      {
        id: "services",
        type: "service-highlights",
        items: [
          { icon: "truck", title: "Free delivery in Dhaka", text: "On orders over ৳3,000. Nationwide in 2–4 days." },
          { icon: "cod", title: "Cash on delivery", text: "Or pay by bKash, Nagad and cards." },
          { icon: "exchange", title: "7-day exchange", text: "Easy size exchange at home." },
          { icon: "craft", title: "Handwoven", text: "Made by artisan families across Bangladesh." },
        ],
      },
      {
        id: "categories",
        type: "category-grid",
        title: "Shop by category",
        collectionSlugs: ["panjabi", "saree", "kurta", "wedding"],
      },
      {
        id: "new-arrivals",
        type: "product-grid",
        eyebrow: "Eid 2027",
        title: "New this season",
        layout: "uniform",
        productIds: ["silk-saree", "indigo-panjabi", "printed-muslin", "lilac-koti-set", "tangail-saree", "ivory-panjabi", "navy-handloom", "sky-kurta"],
        cta: { label: "Shop the collection", href: "#new-arrivals" },
      },
      {
        id: "the-drop",
        type: "clothing-rail",
        eyebrow: "Limited Eid run",
        title: "The Eid Drop",
        productIds: ["eid-panjabi-1", "eid-panjabi-2", "eid-panjabi-3", "eid-panjabi-4", "eid-panjabi-5", "eid-panjabi-6", "eid-panjabi-7", "eid-panjabi-8", "eid-panjabi-9", "eid-panjabi-10"],
        ticker: ["Limited Eid run", "Hand embroidered", "No restocks", "ঈদ মোবারক"],
        tickerTone: "neutral",
        cta: "See availability",
      },
      {
        id: "shop-the-look",
        type: "shop-the-look",
        title: "Complete the look",
        lookIds: ["bd-look-01", "bd-look-02", "bd-look-03"],
      },
      {
        id: "fitting-room",
        type: "fitting-room",
        eyebrow: "Men",
        title: "Try on a panjabi",
        word: "EID",
        background: photo(PHOTO.boutique, "Boutique interior"),
        categories: [
          { label: "Panjabi", productIds: ["white-panjabi", "indigo-panjabi", "ivory-panjabi", "lilac-koti-set"] },
          { label: "Kurta", productIds: ["sky-kurta", "black-kurta", "white-panjabi"] },
          { label: "Wedding", productIds: ["ivory-sherwani", "lilac-koti-set", "ivory-panjabi"] },
        ],
      },
      {
        id: "the-house",
        type: "brand-statement",
        eyebrow: "Our story",
        statement:
          "Every Bunon piece begins on a handloom. We work directly with weaving families in Tangail and Sirajganj, pay fairly, and keep centuries-old techniques alive in clothes made for today.",
        stats: [
          { value: "120+", label: "Artisan families" },
          { value: "3", label: "Weaving districts" },
          { value: "2009", label: "Since" },
        ],
      },
      {
        id: "wedding",
        type: "promo-banner",
        eyebrow: "Wedding season",
        title: "The Wedding Edit",
        description: "Sherwani, silk and hand embroidery for the biggest day. Book a private fitting in Gulshan.",
        image: photo(PHOTO.sherwaniFlowers, "Ivory sherwani hanging beside flowers", "50% 40%"),
        cta: { label: "Book a fitting", href: "#newsletter" },
      },
      {
        id: "reviews",
        type: "testimonials",
        title: "Loved across Bangladesh",
        items: [
          { quote: "The muslin is so fine it feels like air. Delivered to Chattogram in two days, beautifully packed.", name: "Farzana R.", location: "Chattogram", productId: "printed-muslin" },
          { quote: "Wore the indigo set for Eid — the dye and stitching are top quality. Exchange for size was effortless.", name: "Tanvir A.", location: "Dhaka", productId: "indigo-panjabi" },
          { quote: "Finally a local brand that feels truly premium. The silk saree was a gift for my mother — she loved it.", name: "Nusrat J.", location: "Sylhet", productId: "silk-saree" },
        ],
      },
      {
        id: "newsletter",
        type: "newsletter",
        title: "Be first for Eid & Puja drops",
        description: "New collections, festival previews and member-only offers. No spam.",
        placeholder: "Email or phone number",
        cta: "Join",
      },
    ],
  },
});
