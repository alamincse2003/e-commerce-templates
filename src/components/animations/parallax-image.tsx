"use client";

import Image from "next/image";
import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { useGSAP } from "@/animations/gsap-utils";
import { parallax } from "@/animations/scroll-animations";
import type { ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";

type Props = {
  image: ProductImage;
  sizes: string;
  /** Must position the frame (e.g. "relative aspect-[4/5]" or "absolute inset-0"). */
  className?: string;
  /** Multiplier on the preset's parallax strength. */
  intensity?: number;
  priority?: boolean;
  imageClassName?: string;
};

/** Image that drifts against the scroll. The inner layer is oversized so edges never show. */
export function ParallaxImage({ image, sizes, className, intensity = 1, priority, imageClassName }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const a = useAnimationConfig();

  useGSAP(
    () => {
      if (!a.enabled || !frame.current || !inner.current) return;
      // Inner is 140% tall (-20% top/bottom), so ±14% of its height stays within bounds.
      parallax(frame.current, inner.current, Math.min(a.parallax * intensity, 14));
    },
    { dependencies: [a.signature, intensity], revertOnUpdate: true },
  );

  return (
    <div ref={frame} className={cn("overflow-hidden", className)}>
      <div ref={inner} className="absolute inset-x-0 -top-[20%] -bottom-[20%] will-change-transform">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
          style={{ objectPosition: image.position }}
        />
      </div>
    </div>
  );
}
