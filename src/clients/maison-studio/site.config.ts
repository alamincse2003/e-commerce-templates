import { photo, PHOTO } from "../_demo/media";
import { defineSite } from "../types";

/** International luxury sample — USD, global shipping, Atelier theme. */
export default defineSite({
  brand: {
    name: "Maison Élan",
    wordmark: "Maison Élan",
    tagline: "Quiet luxury, made slowly.",
    description: "An independent Paris atelier making considered wardrobes in natural fibres, finished by hand in small runs.",
  },
  seo: {
    title: "Maison Élan — Spring Summer 2027",
    description: "Considered wardrobes in natural fibres. Discover the Spring Summer 2027 collection, limited runs and the fitting room.",
  },
  commerce: {
    currency: "USD",
    locale: "en-US",
    freeShippingThreshold: 400,
    payments: ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"],
  },
  announcement: {
    enabled: true,
    messages: ["Complimentary shipping on orders over $400", "Spring Summer 2027 is now available", "Free alterations on all tailoring"],
  },
  navigation: {
    primary: [
      { label: "New in", href: "#new-arrivals" },
      { label: "Women", href: "#categories" },
      { label: "Men", href: "#fitting-room" },
      { label: "Lookbook", href: "#lookbook" },
      { label: "Journal", href: "#story" },
    ],
    footer: [
      {
        title: "Shop",
        links: [
          { label: "New arrivals", href: "#new-arrivals" },
          { label: "Women", href: "#categories" },
          { label: "Men", href: "#categories" },
          { label: "Limited runs", href: "#the-drop" },
        ],
      },
      {
        title: "The House",
        links: [
          { label: "Our atelier", href: "#the-house" },
          { label: "Journal", href: "#story" },
          { label: "Lookbook", href: "#lookbook" },
        ],
      },
      {
        title: "Client care",
        links: [
          { label: "Shipping & returns", href: "#services" },
          { label: "Size guide", href: "#fitting-room" },
          { label: "Contact us", href: "mailto:hello@maison-elan.example" },
        ],
      },
    ],
  },
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "Pinterest", href: "https://pinterest.com" },
  ],
  contact: { email: "hello@maison-elan.example", phone: "+33 1 42 00 00 00", address: "12 Rue de Saintonge, Paris" },
  features: { previewPanel: true, threeD: true },
  homepage: {
    sections: [
      {
        id: "lookbook",
        type: "lookbook-hero",
        eyebrow: "Collection 07",
        title: "Spring Summer 2027",
        description: "Fluid silks, structured wool and hand-finished leather for a slower, more beautiful season.",
        lookIds: ["look-13", "look-14", "look-15", "look-16", "look-17"],
      },
      {
        id: "services",
        type: "service-highlights",
        items: [
          { icon: "truck", title: "Complimentary shipping", text: "On orders over $400, worldwide." },
          { icon: "exchange", title: "30-day returns", text: "Free returns and exchanges." },
          { icon: "tailor", title: "Free alterations", text: "On all tailoring, in store." },
          { icon: "secure", title: "Secure checkout", text: "Encrypted payments, every order." },
        ],
      },
      {
        id: "categories",
        type: "category-grid",
        title: "Shop by category",
        collectionSlugs: ["women", "men", "knitwear", "outerwear"],
        cta: { label: "View all", href: "#new-arrivals" },
      },
      {
        id: "new-arrivals",
        type: "product-grid",
        title: "New arrivals",
        layout: "uniform",
        productIds: ["cotton-trench", "ivory-suit", "lounge-set", "poplin-shirt", "wrap-coat", "glen-blazer", "rib-sweater", "belted-trench"],
        cta: { label: "Shop all new in", href: "#new-arrivals" },
      },
      {
        id: "the-drop",
        type: "clothing-rail",
        eyebrow: "Atelier Drop 04",
        title: "The Rail",
        productIds: [
          "rail-logo-tee",
          "rail-arch-hoodie",
          "rail-longsleeve",
          "rail-varsity",
          "rail-washed-tee",
          "rail-zip-hoodie",
          "rail-coach",
          "rail-white-tee",
          "rail-burgundy-hoodie",
          "rail-black-longsleeve",
        ],
        ticker: ["Limited run", "Numbered pieces", "No restocks", "Atelier Drop 04"],
        tickerTone: "neutral",
        cta: "See availability",
      },
      {
        id: "shop-the-look",
        type: "shop-the-look",
        title: "Shop the look",
        lookIds: ["look-01", "look-02", "look-03"],
      },
      {
        id: "story",
        type: "editorial-story",
        eyebrow: "Journal",
        title: "Made slowly",
        intro: "Four chapters from the atelier — from raw fibre to the finished garment.",
        chapters: [
          { numeral: "01", title: "Material", body: "Cashmere from Alashan goats, linen from Normandy flax, wool woven in Biella. We start where the fibre starts.", image: photo(PHOTO.knitFlatlay, "Folded knitwear in natural tones") },
          { numeral: "02", title: "Form", body: "Patterns are drafted by hand and refined over a dozen fittings until the garment moves the way it should.", image: photo(PHOTO.circleWindow, "Model seated beneath a circular window") },
          { numeral: "03", title: "Atelier", body: "Fourteen artisans finish every collar, buttonhole and hem in the Marais. Each piece carries their initials.", image: photo(PHOTO.rackKnits, "Knitwear hanging in the atelier") },
          { numeral: "04", title: "Care", body: "Delivered folded in tissue with care notes and a lifetime of complimentary repairs.", image: photo(PHOTO.hangersGreen, "Garments on wooden hangers") },
        ],
        outro: { title: "Visit the atelier", cta: { label: "Book an appointment", href: "#newsletter" } },
      },
      {
        id: "fitting-room",
        type: "fitting-room",
        eyebrow: "Menswear",
        title: "The fitting room",
        word: "FIT",
        background: photo(PHOTO.boutique, "Boutique interior with garments on rails"),
        categories: [
          { label: "Tops", productIds: ["jersey-tee", "heavyweight-tee", "loopback-sweat"] },
          { label: "Tailoring", productIds: ["soft-blazer", "black-suit", "tartan-coat", "field-jacket"] },
          { label: "Knitwear", productIds: ["rib-sweater", "intarsia-knit", "crochet-poncho"] },
        ],
      },
      {
        id: "the-house",
        type: "brand-statement",
        eyebrow: "The house",
        statement:
          "We make fewer things, better. Every piece is cut in our Paris atelier from natural fibres, finished by hand and made to be worn for decades — not seasons.",
        stats: [
          { value: "1987", label: "Founded in Paris" },
          { value: "14", label: "Artisans" },
          { value: "100%", label: "Natural fibres" },
        ],
      },
      {
        id: "archive-sale",
        type: "promo-banner",
        eyebrow: "Private sale — 72 hours",
        title: "The Winter Archive",
        description: "Up to 30% off final pieces from past seasons. Once they're gone, they're gone.",
        image: photo(PHOTO.rackCoats, "Coats hanging in the archive"),
        cta: { label: "Shop the archive", href: "#categories" },
      },
      {
        id: "reviews",
        type: "testimonials",
        title: "What our clients say",
        items: [
          { quote: "The trench is the best thing I own. Four winters in, it looks better every year.", name: "Camille R.", location: "Lyon", productId: "belted-trench" },
          { quote: "You can feel the hand-finishing — the buttonholes alone are worth it. The fit was perfect first time.", name: "James O.", location: "London", productId: "soft-blazer" },
          { quote: "Packaged like a gift and the cashmere is unreal. Already eyeing the next drop.", name: "Aiko T.", location: "Kyoto", productId: "lounge-set" },
        ],
      },
      {
        id: "newsletter",
        type: "newsletter",
        title: "Letters from the atelier",
        description: "Early access to new collections, private appointments and the occasional note from Paris.",
        placeholder: "Email address",
        cta: "Subscribe",
      },
    ],
  },
});
