import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="container-theme flex min-h-[70svh] flex-col items-start justify-center py-24">
      <p className="type-caps text-muted-foreground">Error 404</p>
      <h1 className="type-display mt-4 text-[clamp(3.5rem,10vw,9rem)]">Lost in the atelier</h1>
      <p className="mt-6 max-w-md text-muted-foreground">The page you&apos;re looking for has moved, sold out, or never existed.</p>
      <Button href="/" className="mt-10">
        Back to the house
      </Button>
    </section>
  );
}
