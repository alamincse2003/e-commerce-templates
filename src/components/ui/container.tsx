import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("container-theme", className)}>{children}</div>;
}
