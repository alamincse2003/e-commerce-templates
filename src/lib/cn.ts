/** Tiny className joiner — avoids pulling in clsx/tailwind-merge for a template this size. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
