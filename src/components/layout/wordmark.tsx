import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  wordmark: string;
  logo?: { src: string; alt: string; width: number; height: number };
  className?: string;
};

/** Brand mark: an image logo if configured, otherwise the wordmark in the theme's logo font. */
export function Wordmark({ wordmark, logo, className }: Props) {
  if (logo) {
    return <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={cn("h-7 w-auto", className)} priority />;
  }
  return <span className={cn("type-logo whitespace-nowrap", className)}>{wordmark}</span>;
}
