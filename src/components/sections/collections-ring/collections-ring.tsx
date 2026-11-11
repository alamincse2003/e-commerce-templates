"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { RevealText } from "@/components/animations/reveal-text";
import type { Collection } from "@/config/schema/catalog";
import { cn } from "@/lib/cn";
import { pad2 } from "@/lib/format";

// Three.js is ~150kB gz — only fetched when this section approaches the viewport.
const RingCanvas = dynamic(() => import("./ring-canvas"), { ssr: false });

type Props = {
  titleId: string;
  eyebrow?: string;
  title: string;
  description: string;
  collections: Collection[];
  threeD: boolean;
};

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function CollectionsRingClient({ titleId, eyebrow, title, description, collections, threeD }: Props) {
  const a = useAnimationConfig();
  const stage = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setNear(true);
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    setWebgl(supportsWebGL());
    return () => io.disconnect();
  }, []);

  const use3D = threeD && a.enabled && webgl === true;

  return (
    <div className="container-theme grid items-center gap-10 lg:grid-cols-12">
      <div className="relative z-10 lg:col-span-4">
        {eyebrow ? <p className="t-small mb-3 text-muted-foreground">{eyebrow}</p> : null}
        <RevealText as="h2" id={titleId} className="type-heading t-h1 split-safe">
          {title}
        </RevealText>
        <p className="mt-5 max-w-sm text-muted-foreground">{description}</p>
        <ol className="mt-10 border-t border-border">
          {collections.map((c, i) => (
            <li key={c.slug} className="border-b border-border">
              <a
                href={c.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn("group flex items-baseline gap-4 py-3 transition-colors", active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
              >
                <span className="t-small w-6 tabular-nums">{pad2(i + 1)}</span>
                <span className="t-h2">{c.title}</span>
                <span className={cn("ml-auto text-xs transition-opacity", active === i ? "opacity-100" : "opacity-0")}>{c.description}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>

      <div ref={stage} className="relative aspect-square w-full lg:col-span-8 lg:aspect-[5/4]">
        {use3D && near ? (
          <RingCanvas
            images={collections.map((c) => c.image.src)}
            activeIndex={active}
            onActiveChange={setActive}
            running={visible}
            autoSpeed={0.12 / a.durationScale}
          />
        ) : null}
        {/* Fallback (no WebGL / motion off / 3D disabled): a quiet editorial mosaic */}
        {webgl !== null && !use3D ? (
          <div className="grid h-full grid-cols-4 grid-rows-2 gap-2">
            {collections.slice(0, 8).map((c, i) => (
              <a key={c.slug} href={c.href} className={cn("relative overflow-hidden rounded-card bg-muted", i === 0 && "col-span-2 row-span-2")} onMouseEnter={() => setActive(i)}>
                <Image src={c.image.src} alt={c.image.alt} fill sizes="25vw" className="object-cover" />
              </a>
            ))}
          </div>
        ) : null}
        {use3D ? (
          <p className="t-small pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-muted-foreground" aria-hidden>
            Drag to turn — {collections[active]?.title}
          </p>
        ) : null}
      </div>
    </div>
  );
}
