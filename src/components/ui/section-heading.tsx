import { ArrowRight } from "lucide-react";
import { RevealText } from "@/components/animations/reveal-text";
import { cn } from "@/lib/cn";

type Props = {
  title: string;
  /** Optional small kicker above the title (sentence case, muted). */
  eyebrow?: string;
  description?: string;
  /** Right-aligned link, e.g. "View all". */
  link?: { label: string; href: string };
  align?: "left" | "center";
  className?: string;
  /** id for the <h2>, so the section can reference it with aria-labelledby. */
  titleId?: string;
};

/**
 * The single section header used across the site: title left, quiet link right, hairline below.
 * Consistency here does more for perceived quality than any effect.
 */
export function SectionHeading({ title, eyebrow, description, link, align = "left", className, titleId }: Props) {
  const centered = align === "center";
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-end md:justify-between", centered && "items-center text-center md:flex-col md:items-center", className)}>
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow ? <p className="t-small mb-3 text-muted-foreground">{eyebrow}</p> : null}
        <RevealText as="h2" id={titleId} className="type-heading t-h1 split-safe">
          {title}
        </RevealText>
        {description ? <p className="t-body mt-3 max-w-xl text-muted-foreground">{description}</p> : null}
      </div>
      {link ? (
        <a href={link.href} className="t-small group inline-flex shrink-0 items-center gap-2 border-b border-current pb-0.5">
          {link.label}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
        </a>
      ) : null}
    </div>
  );
}
