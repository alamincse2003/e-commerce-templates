"use client";

import Image from "next/image";
import { useRef } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { gsap, useGSAP } from "@/animations/gsap-utils";
import { imageReveal } from "@/animations/scroll-animations";
import type { ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";

type Props = {
  image: ProductImage;
  sizes: string;
  /** Classes for the frame — set the aspect ratio / size here. */
  className?: string;
  priority?: boolean;
};

/** Clip-path image reveal on scroll (GSAP). The frame is GSAP-owned — don't wrap it in Motion. */
export function RevealImage({ image, sizes, className, priority }: Props) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const a = useAnimationConfig();

  useGSAP(
    () => {
      if (!frame.current || !inner.current) return;
      if (!a.enabled) {
        gsap.set(frame.current, { visibility: "visible" });
        return;
      }
      imageReveal(frame.current, inner.current, a);
    },
    { dependencies: [a.signature], revertOnUpdate: true },
  );

  return (
    <div ref={frame} data-reveal="image" className={cn("relative overflow-hidden bg-muted", className)}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={{ objectPosition: image.position }}
        />
      </div>
    </div>
  );
}
