import { ArrowUpRight } from "lucide-react";
import type { SiteConfig } from "@/config/schema/site";
import { Wordmark } from "./wordmark";

/** Cached so the year is computed at build/revalidation rather than blocking prerender. */
async function CopyrightYear() {
  "use cache";
  return <>{new Date().getFullYear()}</>;
}

/** Structured footer: brand + contact, link columns, payment methods, legal bar. Server component. */
export function Footer({ site }: { site: SiteConfig }) {
  const { brand, navigation, social, contact, commerce } = site;
  return (
    <footer className="bg-inverse text-inverse-foreground">
      <div className="container-theme grid gap-12 pt-20 pb-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark wordmark={brand.wordmark} logo={brand.logo} className="text-3xl" />
          <p className="t-body mt-5 max-w-sm opacity-70">{brand.description}</p>
          {brand.localTagline ? <p className="t-lead mt-4 opacity-90">{brand.localTagline}</p> : null}
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-5 md:col-start-6">
          {navigation.footer.map((group) => (
            <div key={group.title}>
              <p className="t-small font-medium">{group.title}</p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="t-small opacity-65 transition-opacity hover:opacity-100">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="md:col-span-2 md:col-start-11">
          <p className="t-small font-medium">Contact</p>
          <ul className="t-small mt-4 space-y-2.5 opacity-65">
            <li>
              <a href={`mailto:${contact.email}`} className="hover:opacity-100">
                {contact.email}
              </a>
            </li>
            {contact.phone ? (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
              </li>
            ) : null}
            <li>{contact.address}</li>
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer" className="t-small inline-flex items-center gap-0.5 hover:opacity-60">
                  {s.label}
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-inverse-foreground/12">
        <div className="container-theme flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
          <p className="t-small opacity-55">
            © <CopyrightYear /> {brand.name}. All rights reserved.
          </p>
          {commerce.payments?.length ? (
            <ul className="flex flex-wrap items-center gap-2" aria-label="Accepted payment methods">
              {commerce.payments.map((p) => (
                <li key={p} className="rounded-[3px] border border-inverse-foreground/20 px-2.5 py-1 text-[0.6875rem] tracking-[0.02em] opacity-80">
                  {p}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
