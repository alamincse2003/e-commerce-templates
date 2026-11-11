import { z } from "zod";
import { hexColor } from "./theme";

export const imageSchema = z.object({
  src: z.string().refine((s) => s.startsWith("/") || s.startsWith("https://"), "Use an absolute https URL or a /public path"),
  alt: z.string(),
  /** CSS object-position, e.g. "50% 20%". */
  position: z.string().optional(),
});

export const garmentSchema = z.object({
  type: z.enum(["tee", "longsleeve", "hoodie", "zip-hoodie", "varsity", "coach-jacket", "panjabi"]),
  base: hexColor,
  trim: hexColor.optional(),
  print: z
    .object({
      kind: z.enum(["wordmark", "arch", "emblem", "big"]),
      text: z.string(),
      color: hexColor,
    })
    .optional(),
});

export const productSchema = z
  .object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    /** Small caps line above the name (brand / line / collection). */
    label: z.string(),
    category: z.enum(["tops", "bottoms", "outerwear", "knitwear", "dresses", "shoes", "accessories"]),
    price: z.number().nonnegative(),
    compareAtPrice: z.number().nonnegative().optional(),
    images: z.array(imageSchema),
    /** Model shot used by the fitting room "try on". Falls back to images[0]. */
    fitImage: imageSchema.optional(),
    colors: z.array(z.object({ name: z.string(), hex: hexColor })).min(1),
    sizes: z.array(z.string()).min(1),
    soldOutSizes: z.array(z.string()).optional(),
    badge: z.string().optional(),
    description: z.string(),
    /** Illustrated garment used by the clothing rail. */
    garment: garmentSchema.optional(),
  })
  .refine((p) => p.images.length > 0 || p.garment, {
    message: "A product needs at least one image or a garment illustration",
  });

export const lookSchema = z.object({
  id: z.string(),
  number: z.string(),
  title: z.string(),
  image: imageSchema,
  items: z
    .array(
      z.object({
        productId: z.string(),
        /** Percent coordinates within a 4:5 crop of the look image. */
        hotspot: z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100) }).optional(),
      }),
    )
    .min(1),
  bundleDiscount: z.number().min(0).max(0.9),
});

export const collectionSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  image: imageSchema,
  href: z.string(),
});

export const catalogSchema = z.object({
  products: z.array(productSchema),
  looks: z.array(lookSchema),
  collections: z.array(collectionSchema),
});

export type ProductImage = z.infer<typeof imageSchema>;
export type Garment = z.infer<typeof garmentSchema>;
export type Product = z.infer<typeof productSchema>;
export type Look = z.infer<typeof lookSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
