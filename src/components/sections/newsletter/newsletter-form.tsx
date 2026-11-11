"use client";

import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Integration point: set `endpoint` on the newsletter section to POST `{ email }` to your
 * ESP (Klaviyo, Mailchimp, a route handler…). Without an endpoint the form runs in demo mode
 * and only validates locally — nothing is sent anywhere.
 */
export function NewsletterForm({ placeholder, cta, endpoint }: { placeholder: string; cta: string; endpoint?: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL.test(value)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("loading");
    try {
      if (endpoint) {
        const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: value }) });
        if (!res.ok) throw new Error(String(res.status));
      }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mt-8">
      <AnimatePresence mode="wait" initial={false}>
        {status === "done" ? (
          <motion.p key="done" role="status" className="flex items-center gap-3 border-b border-foreground py-4" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Check className="h-4 w-4" />
            {endpoint ? "Thank you — you're on the list." : "Thank you — you're on the list (demo mode: no email was sent)."}
          </motion.p>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }}>
            <label htmlFor={id} className="sr-only">
              Email address
            </label>
            <div className="flex items-center border-b border-foreground focus-within:border-accent">
              <input
                id={id}
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={placeholder}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                className="t-body min-w-0 flex-1 bg-transparent py-3.5 outline-none placeholder:text-muted-foreground"
              />
              <button type="submit" disabled={status === "loading"} className="t-label group inline-flex items-center gap-2 py-3.5 pl-4 disabled:opacity-50">
                {status === "loading" ? "Sending…" : cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" strokeWidth={1.4} />
              </button>
            </div>
            {error ? (
              <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-accent">
                {error}
              </p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
