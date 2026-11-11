import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "ghost" | "inverse" | "link";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2.5 whitespace-nowrap t-label transition-[background-color,color,border-color,opacity] duration-300 ease-out disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "rounded-button bg-button text-button-foreground hover:opacity-85",
  outline: "rounded-button border border-foreground/80 hover:bg-foreground hover:text-background",
  ghost: "rounded-button hover:bg-foreground/5",
  inverse: "rounded-button bg-inverse-foreground text-inverse hover:opacity-85",
  link: "underline underline-offset-[6px] decoration-1 hover:decoration-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4",
  md: "h-11 px-6",
  lg: "h-12 px-8",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };
type ButtonProps = CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type LinkProps = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Theme-driven button. Renders a link when `href` is passed (hash links stay plain anchors for Lenis). */
export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const cls = cn(base, variants[variant], variant !== "link" && sizes[size], className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, children: _ch, ...rest } = props;
    if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
      return (
        <a href={href} className={cls} {...rest}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }
  const { variant: _v, size: _s, className: _c, children: _ch, type = "button", ...rest } = props;
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
