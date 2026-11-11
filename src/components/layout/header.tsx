"use client";

import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { useAnimationConfig } from "@/animations/animation-provider";
import { uiTransition } from "@/animations/motion-variants";
import { cn } from "@/lib/cn";
import { selectCount, useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { MobileMenu } from "./mobile-menu";
import { Wordmark } from "./wordmark";

type NavLink = { label: string; href: string };
type Props = {
  wordmark: string;
  logo?: { src: string; alt: string; width: number; height: number };
  links: NavLink[];
};

const iconBtn = "relative inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-60";

/** Nav left · wordmark centre · utilities right. Tucks away on scroll-down, returns on scroll-up. */
export function Header({ wordmark, logo, links }: Props) {
  const a = useAnimationConfig();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const count = useCartStore(selectCount);
  const openCart = useCartStore((s) => s.open);
  const wished = useWishlistStore((s) => s.ids.length);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 320);
    setScrolled(y > 8);
  });

  return (
    <>
      <motion.header
        className={cn("sticky top-0 z-40 border-b transition-colors duration-300", scrolled ? "glass border-border" : "border-transparent bg-background")}
        animate={{ y: hidden && !menuOpen ? "-100%" : "0%" }}
        transition={uiTransition(a)}
      >
        <div className="container-theme h-header grid grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="flex items-center">
            <button type="button" className={cn(iconBtn, "-ml-2 lg:hidden")} aria-label="Open menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(true)}>
              <Menu className="h-5 w-5" strokeWidth={1.3} />
            </button>
            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href} className="t-small group relative py-2 font-medium">
                      {link.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <a href="#top" className="text-[1.375rem] lg:text-[1.625rem]" aria-label={`${wordmark} — home`}>
            <Wordmark wordmark={wordmark} logo={logo} />
          </a>

          <div className="flex items-center justify-end gap-0.5 sm:gap-1">
            <a href="#new-arrivals" className={cn(iconBtn, "hidden sm:inline-flex")} aria-label="Search products">
              <Search className="h-4.5 w-4.5" strokeWidth={1.3} />
            </a>
            <span className={cn(iconBtn, "hidden sm:inline-flex")} aria-label={`Wishlist, ${wished} items`} role="img">
              <Heart className="h-4.5 w-4.5" strokeWidth={1.3} />
              {wished ? <span className="absolute top-1.5 right-1 text-[10px] tabular-nums">{wished}</span> : null}
            </span>
            <button type="button" onClick={openCart} className={cn(iconBtn, "-mr-2")} aria-label={`Open bag, ${count} items`}>
              <ShoppingBag className="h-4.5 w-4.5" strokeWidth={1.3} />
              {count ? (
                <span className="absolute top-1 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] leading-none text-background tabular-nums">
                  {count}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </motion.header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={links} wordmark={wordmark} />
    </>
  );
}
