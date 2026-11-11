import { cn } from "@/lib/cn";

type Props = { items: string[]; className?: string; separator?: string; reverse?: boolean };

/**
 * CSS-only infinite ticker (no JS cost). Speed follows the animation preset via --marquee-duration;
 * paused when motion is off. Content is announced once; the visual duplicates are aria-hidden.
 */
export function Marquee({ items, className, separator = "•", reverse }: Props) {
  // Repeat enough times that one half always overflows the widest screens.
  const run = Array.from({ length: Math.max(2, Math.ceil(12 / items.length)) }, () => items).flat();
  const group = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {run.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5">{item}</span>
          <span aria-hidden>{separator}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <span className="sr-only">{items.join(". ")}</span>
      <div
        className="animate-marquee flex w-max"
        style={reverse ? { animationDirection: "reverse" } : undefined}
        aria-hidden
      >
        {group(true)}
        {group(true)}
      </div>
    </div>
  );
}
