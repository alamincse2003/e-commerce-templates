import { cn } from "@/lib/cn";

export function Badge({ children, className, tone = "default" }: { children: React.ReactNode; className?: string; tone?: "default" | "accent" }) {
  return (
    <span
      className={cn(
        "t-small inline-flex items-center px-2 py-0.5",
        tone === "accent" ? "bg-accent text-accent-foreground" : "bg-background text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}
