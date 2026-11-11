"use client";

import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import type { Product, ProductImage } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { selectCount, useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cardPose, cardSlot } from "./card-pose";
import { FitBar } from "./fit-bar";
import { GlassCard } from "./glass-card";

type Props = {
  id: string;
  title: string;
  eyebrow?: string;
  word: string;
  background?: ProductImage;
  categories: { label: string; products: Product[] }[];
};

/** Glass when the theme enables it (and a room photo sits behind); solid otherwise. */
const panel = "glass border";

/**
 * Virtual fitting room: an arched mirror with the tried-on look, product cards fanned in 3D
 * either side, and a selection bar. Studio surface by default; optional room photo behind.
 */
export function FittingRoomClient({ id, title, eyebrow, word, background, categories }: Props) {
  const a = useAnimationConfig();
  const stage = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1200);
  const [cat, setCat] = useState(0);
  const [head, setHead] = useState(0);
  const [selectedId, setSelectedId] = useState(categories[0].products[0].id);
  const openCart = useCartStore((s) => s.open);
  const bagCount = useCartStore(selectCount);
  const toggleWish = useWishlistStore((s) => s.toggle);
  const wished = useWishlistStore((s) => s.ids.includes(selectedId));

  const products = categories[cat].products;
  const all = categories.flatMap((c) => c.products);
  const selected = all.find((p) => p.id === selectedId) ?? products[0];
  const fit = selected.fitImage ?? selected.images[0];

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const changeCategory = (i: number) => {
    setCat(i);
    setHead(0);
    setSelectedId(categories[i].products[0].id);
  };

  const spring = a.enabled ? { type: "spring" as const, stiffness: 140, damping: 22 } : { duration: 0 };

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="relative isolate overflow-hidden bg-surface lg:min-h-[max(100svh,820px)]">
      {background ? (
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image src={background.src} alt="" fill sizes="100vw" className="scale-105 object-cover blur-[2px]" />
          <div className="absolute inset-0 bg-background/40" />
        </div>
      ) : null}

      {/* Oversized word, tone-on-tone */}
      <p aria-hidden className="type-display pointer-events-none absolute inset-x-0 top-[21%] -z-10 select-none text-center text-[clamp(7rem,26vw,26rem)] leading-[0.8] text-background/90">
        {word}
      </p>

      <div className="relative px-4 pt-10 pb-8 lg:absolute lg:inset-0 lg:p-8">
        {/* Title + category tabs */}
        <div className="flex flex-col items-center gap-5 text-center lg:absolute lg:top-8 lg:left-1/2 lg:-translate-x-1/2">
          <div>
            {eyebrow ? <p className="t-small text-muted-foreground">{eyebrow}</p> : null}
            <h2 id={`${id}-title`} className="type-heading t-h2 mt-1">
              {title}
            </h2>
          </div>
          <div role="tablist" aria-label="Categories" className={cn(panel, "no-scrollbar flex max-w-full gap-6 overflow-x-auto px-5 pt-2.5")}>
            {categories.map((c, i) => (
              <button
                key={c.label}
                role="tab"
                type="button"
                aria-selected={cat === i}
                onClick={() => changeCategory(i)}
                className={cn("t-small relative pb-2.5 whitespace-nowrap transition-colors", cat === i ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                {c.label}
                {cat === i ? <motion.span layoutId={`${id}-tab`} className="absolute inset-x-0 -bottom-px h-px bg-foreground" transition={spring} /> : null}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className={cn(panel, "absolute top-1/2 left-8 hidden -translate-y-1/2 flex-col lg:flex")}>
          <button type="button" onClick={openCart} aria-label={`Open bag, ${bagCount} items`} className="relative inline-flex h-11 w-11 items-center justify-center hover:bg-muted">
            <ShoppingBag className="h-4 w-4" strokeWidth={1.4} />
            {bagCount ? <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-foreground" /> : null}
          </button>
          <button
            type="button"
            onClick={() => toggleWish(selected.id)}
            aria-pressed={wished}
            aria-label={wished ? `Remove ${selected.name} from wishlist` : `Save ${selected.name}`}
            className="inline-flex h-11 w-11 items-center justify-center border-t border-border hover:bg-muted"
          >
            <Heart className={cn("h-4 w-4", wished && "fill-current")} strokeWidth={1.4} />
          </button>
        </div>

        {/* Mirror + model */}
        <div className="relative mx-auto mt-8 aspect-[3/4.1] w-[min(76vw,400px)] lg:absolute lg:bottom-0 lg:left-1/2 lg:mt-0 lg:h-[64%] lg:w-auto lg:-translate-x-1/2">
          <div className="absolute inset-0 overflow-hidden rounded-t-full bg-muted">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={fit.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={a.enabled ? { duration: a.duration * 0.6, ease: a.ease.css } : { duration: 0 }}
              >
                <Image src={fit.src} alt={fit.alt} fill sizes="(min-width: 1024px) 32vw, 76vw" className="object-cover" style={{ objectPosition: fit.position ?? "50% 25%" }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 3D carousel (desktop) */}
        <div ref={stage} className="pointer-events-none absolute inset-x-0 top-[24%] hidden h-[44%] [perspective:1800px] lg:block">
          {products.map((p, i) => {
            const { side, depth } = cardSlot(i, head, products.length);
            const pose = cardPose(side, depth, width);
            return (
              <motion.div
                key={p.id}
                className="pointer-events-auto absolute top-0 left-1/2 -ml-[calc(var(--card-w)/2)] w-[var(--card-w)] [--card-w:clamp(150px,12vw,200px)] [transform-style:preserve-3d]"
                initial={false}
                animate={{ x: pose.x, rotateY: pose.rotateY, scale: pose.scale, opacity: pose.opacity }}
                style={{ zIndex: pose.zIndex }}
                transition={spring}
              >
                <GlassCard product={p} selected={p.id === selected.id} onTryOn={() => setSelectedId(p.id)} className={panel} />
              </motion.div>
            );
          })}
        </div>
        {products.length > 2 ? (
          <>
            <button type="button" onClick={() => setHead((h) => h - 1)} aria-label="Previous pieces" className={cn(panel, "absolute top-[44%] left-[9%] hidden h-10 w-10 items-center justify-center rounded-full lg:inline-flex")}>
              <ChevronLeft className="h-4 w-4" strokeWidth={1.4} />
            </button>
            <button type="button" onClick={() => setHead((h) => h + 1)} aria-label="Next pieces" className={cn(panel, "absolute top-[44%] right-[9%] hidden h-10 w-10 items-center justify-center rounded-full lg:inline-flex")}>
              <ChevronRight className="h-4 w-4" strokeWidth={1.4} />
            </button>
          </>
        ) : null}

        {/* Strip (mobile/tablet) */}
        <ul className="no-scrollbar -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 lg:hidden">
          {products.map((p) => (
            <li key={p.id} className="w-36 shrink-0 snap-start">
              <GlassCard product={p} selected={p.id === selected.id} onTryOn={() => setSelectedId(p.id)} className={panel} />
            </li>
          ))}
        </ul>

        <FitBar product={selected} className={cn(panel, "shadow-theme")} />
      </div>
    </section>
  );
}
