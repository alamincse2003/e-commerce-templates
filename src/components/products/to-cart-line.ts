import type { Product } from "@/config/schema/catalog";
import type { CartLineInput } from "@/store/cart-store";

/** Maps a product (+ chosen options) to a cart line. */
export function toCartLine(
  product: Product,
  opts: { size?: string; color?: string; bundle?: CartLineInput["bundle"] } = {},
): CartLineInput {
  const size = opts.size ?? product.sizes.find((s) => !product.soldOutSizes?.includes(s)) ?? product.sizes[0];
  return {
    productId: product.id,
    name: product.name,
    label: product.label,
    price: product.price,
    image: product.images[0],
    garment: product.images[0] ? undefined : product.garment,
    size,
    color: opts.color ?? product.colors[0].name,
    bundle: opts.bundle,
  };
}
