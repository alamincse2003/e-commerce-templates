import type { ProductImage } from "@/config/schema/catalog";

/**
 * Demo photography from Unsplash (free to use). Replace with client assets in /public or a CDN —
 * any https host must be allowed in next.config.ts `images.remotePatterns`.
 *
 * Crops use imgix focal-point params so one editorial photo can yield several product thumbnails.
 */
export const PHOTO = {
  // Editorial looks (full body)
  whiteTankLook: "1598554747436-c9293d6a588f",
  camelCoatLook: "1618244972963-dbee1a7edc95",
  fieldJacketLook: "1544022613-e87ca75a784a",
  shirtDress: "1617019114583-affb34d1b3cd",
  beltedTrench: "1539533018447-63fcce2678e3",
  glenBlazer: "1608234808654-2a8875faa7fd",
  corduroyDress: "1585487000160-6ebcfceb0d03",
  creamJumpsuit: "1589465885857-44edb59bbff2",
  blackCoat: "1554412933-514a83d2f3c8",
  redGown: "1612336307429-8a898d10e223",
  // Fitting-room model shots
  whiteTeeMan: "1586790170083-2f9ceadc732d",
  blackTeeMan: "1622519407650-3df9883f76a5",
  pinkTeeMan: "1622470953794-aa9c70b0fb9d",
  sweatshirtMan: "1516826957135-700dedea698c",
  leatherBiker: "1487222477894-8943e31ef7b2",
  greyBlazerMan: "1630173250799-2813d34ed14b",
  plaidCoat: "1485968579580-b6d095142e6e",
  cranberryKnit: "1506634572416-48cdfe530110",
  chevronKnit: "1475180098004-ca77a66827be",
  // Product shots
  whiteTee: "1521572163474-6864f9cf17ab",
  blackTeeHanger: "1618354691373-d851c5c3a990",
  whiteSweatshirt: "1620799140408-edc6dcb6d633",
  chambray: "1596755094514-f87e34085b2c",
  denimJacket: "1611312449408-fcece27cdbb7",
  bomber: "1591047139829-d91aecb6caea",
  poncho: "1434389677669-e08b4cac3105",
  redBag: "1584917865442-de89df76afd3",
  beanies: "1576871337632-b9aef4c17ab9",
  jeans: "1475178626620-a4d074967452",
  pleatedSkirt: "1533659828870-95ee305cee3e",
  // Atmosphere
  boutique: "1441984904996-e0b6ba687e04",
  rackKnits: "1558769132-cb1aea458c5e",
  rackCoats: "1512436991641-6745cdb1723f",
  rackHangers: "1490481651871-ab68de25d43d",
  hangersGreen: "1523381210434-271e8be1f52b",
  hangersKnits: "1509319117193-57bab727e09d",
  circleWindow: "1488161628813-04466f872be2",
  flatlay: "1525507119028-ed4c629a60a3",
  knitFlatlay: "1556905055-8f358a7a47b2",
  rackStudio: "1551232864-3f0890e580d9",
  // Neutral studio / editorial (international)
  creamSuit: "1627130697816-4d71dbfe6a5b",
  hatCoat: "1653875842174-429c1b467548",
  greyKnit: "1574201635302-388dd92a4c3f",
  whiteShirt: "1526413232644-8a40f03cc03b",
  trenchStreet: "1648066380643-675d30c3cd17",
  trenchStudio: "1633821879282-0c4e91f96232",
  knitSet: "1766056278792-d5b15656b7e8",
  loungeSeated: "1632282005753-29f80ed13c93",
  wrapCoat: "1617733401065-c7bdf0b33417",
  blackSuit: "1618886614638-80e3c103d31a",
  // South Asian / Bangladeshi
  skyKurta: "1744208525808-66c60e0ea68c",
  whitePanjabi: "1774527929750-f2f32fbb3b93",
  whitePanjabi2: "1774527929685-0372244a6232",
  indigoPanjabi: "1770359993283-a2c2f386584e",
  lilacKoti: "1774267230662-575d1f4ec1bd",
  ivoryPanjabi: "1781106785213-ee999c3edf50",
  blackKurta: "1744551358303-46edae8b374b",
  sherwaniHanging: "1783188223691-8a233ee51cd8",
  sherwaniFlowers: "1783188223239-d27dbdd0b95a",
  sherwaniModel: "1729347917808-e3e35a462fec",
  silkSaree: "1742287724816-4a8a1cc7ad5c",
  navySaree: "1739429945791-eb753aa21985",
  printedSaree: "1752469113156-817efc1ea765",
  greenSaree: "1770838447151-05a876cdee3d",
  katanSaree: "1692992193981-d3d92fabd9cb",
} as const;

type Crop = { w?: number; h?: number; focal?: { x: number; y: number; zoom: number } };

export function unsplash(id: string, { w = 1600, h, focal }: Crop = {}): string {
  const p = new URLSearchParams({ auto: "format", fit: "crop", q: "80", w: String(w) });
  if (h) p.set("h", String(h));
  if (focal) {
    p.set("crop", "focalpoint");
    p.set("fp-x", String(focal.x));
    p.set("fp-y", String(focal.y));
    p.set("fp-z", String(focal.zoom));
  }
  return `https://images.unsplash.com/photo-${id}?${p.toString()}`;
}

/** Full photo. */
export const photo = (id: string, alt: string, position?: string): ProductImage => ({ src: unsplash(id), alt, position });

/** 4:5 focal crop of a photo — used to cut product thumbnails out of editorial shots. */
export const crop = (id: string, alt: string, x: number, y: number, zoom: number): ProductImage => ({
  src: unsplash(id, { w: 1000, h: 1250, focal: { x, y, zoom } }),
  alt,
});
