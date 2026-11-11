"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import type { Product, ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";
import { Hotspot } from "./hotspot";
import { LookItems } from "./look-items";

export type ShoppableLook = {
  id: string;
  number: string;
  title: string;
  image: ProductImage;
  bundleDiscount: number;
  items: { product: Product; hotspot: { x: number; y: number } }[];
};

/**
 * Outfit carousel with shoppable hotspots. Hotspot ↔ list hover/focus are synced,
 * so either side highlights the same piece.
 */
export function LookViewer({ looks }: { looks: ShoppableLook[] }) {
  const a = useAnimationConfig();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [activeItem, setActiveItem] = useState<number | null>(null);
  const look = looks[index];

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + looks.length) % looks.length);
    setActiveItem(null);
  };

  const t = a.enabled ? { duration: a.duration * 0.9, ease: a.ease.css } : { duration: 0 };

  return (
    <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-theme">
      <div className="lg:col-span-7">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <p className="t-small text-muted-foreground">Look {look.number}</p>
            <p className="t-h2 mt-0.5">{look.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous look" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-foreground">
              <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <span className="t-small w-12 text-center tabular-nums">
              {pad2(index + 1)}/{pad2(looks.length)}
            </span>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next look" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border hover:border-foreground">
              <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </div>
        </div>

        <div className="relative mx-auto mt-6 aspect-[4/5] max-h-[82svh] w-full max-w-[640px] overflow-hidden rounded-card bg-muted">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={look.id}
              className="absolute inset-0"
              custom={direction}
              variants={{
                enter: (d: number) => ({ clipPath: d > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }),
                center: { clipPath: "inset(0% 0% 0% 0%)" },
                exit: { opacity: 0.6 },
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={t}
            >
              <Image src={look.image.src} alt={look.image.alt} fill sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
              {look.items.map((item, i) => (
                <Hotspot
                  key={item.product.id}
                  index={i}
                  x={item.hotspot.x}
                  y={item.hotspot.y}
                  name={item.product.name}
                  active={activeItem === i}
                  onActivate={() => setActiveItem(i)}
                  onDeactivate={() => setActiveItem((cur) => (cur === i ? null : cur))}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <p className="t-small mt-4 text-center text-muted-foreground">Tap a dot to shop the piece</p>

        {/* Look thumbnails */}
        <div className="mt-6 flex justify-center gap-3" role="tablist" aria-label="Looks">
          {looks.map((l, i) => (
            <button
              key={l.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Look ${l.number}: ${l.title}`}
              onClick={() => go(i)}
              className={cn("relative h-16 w-12 overflow-hidden rounded-card transition-[opacity,outline-color] duration-300", i === index ? "outline outline-1 outline-offset-2 outline-foreground" : "opacity-50 hover:opacity-100")}
            >
              <Image src={l.image.src} alt="" fill sizes="48px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-5 lg:col-start-8">
        <LookItems look={look} activeItem={activeItem} onActiveItem={setActiveItem} />
      </div>
    </div>
  );
}
