import Image from "next/image";
import type { Garment, ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { GarmentSvg } from "./garment-svg";

type Props = { image?: ProductImage; garment?: Garment; sizes: string; className?: string };

/** Square-ish product thumbnail that falls back to the garment illustration. */
export function ProductThumb({ image, garment, sizes, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden rounded-card bg-muted", className)}>
      {image ? (
        <Image src={image.src} alt={image.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: image.position }} />
      ) : garment ? (
        <GarmentSvg garment={garment} showHanger={false} className="absolute inset-[8%] h-[84%] w-[84%]" />
      ) : null}
    </div>
  );
}
