import "server-only";
import { z } from "zod";
import { animationConfigSchema, type AnimationConfig } from "@/config/schema/animation";
import { catalogSchema, type Catalog, type Collection, type Look, type Product } from "@/config/schema/catalog";
import { siteConfigSchema, type SiteConfig } from "@/config/schema/site";
import { themeSchema, type Theme } from "@/config/schema/theme";
import maisonStudio from "./maison-studio";
import type { ClientDefinition } from "./types";

/**
 * Client registry. Add a folder under /clients, register it here, and select it with
 * NEXT_PUBLIC_CLIENT=<id>. Everything is validated once at build/boot so a broken config
 * fails loudly instead of rendering a half-broken store.
 */
const registry = {
  "maison-studio": maisonStudio,
} satisfies Record<string, ClientDefinition>;

export type ClientId = keyof typeof registry;
export const CLIENT_IDS = Object.keys(registry) as ClientId[];

export type ResolvedClient = {
  id: string;
  site: SiteConfig;
  theme: Theme;
  animation: AnimationConfig;
  catalog: Catalog;
};

function fail(clientId: string, label: string, error: z.ZodError): never {
  throw new Error(`[client:${clientId}] invalid ${label}:\n${z.prettifyError(error)}`);
}

function resolveClient(def: ClientDefinition): ResolvedClient {
  const site = siteConfigSchema.safeParse(def.site);
  if (!site.success) fail(def.id, "site.config", site.error);
  const theme = themeSchema.safeParse(def.theme);
  if (!theme.success) fail(def.id, "theme.config", theme.error);
  const animation = animationConfigSchema.safeParse(def.animation);
  if (!animation.success) fail(def.id, "animation.config", animation.error);
  const catalog = catalogSchema.safeParse(def.catalog);
  if (!catalog.success) fail(def.id, "products", catalog.error);

  // Cross-reference checks: every id a section points at must exist.
  const productIds = new Set(catalog.data.products.map((p) => p.id));
  const lookIds = new Set(catalog.data.looks.map((l) => l.id));
  const collectionSlugs = new Set(catalog.data.collections.map((c) => c.slug));
  const missing: string[] = [];
  const need = (set: Set<string>, id: string, where: string) => {
    if (!set.has(id)) missing.push(`${where} → "${id}"`);
  };
  for (const look of catalog.data.looks) for (const item of look.items) need(productIds, item.productId, `look ${look.id}`);
  for (const s of site.data.homepage.sections) {
    const where = `section ${s.id}`;
    if ("productIds" in s) s.productIds.forEach((id) => need(productIds, id, where));
    if ("lookIds" in s) s.lookIds.forEach((id) => need(lookIds, id, where));
    if (s.type === "lookbook-hero" && s.handoffProductId) need(productIds, s.handoffProductId, where);
    if ("collectionSlugs" in s) s.collectionSlugs.forEach((id) => need(collectionSlugs, id, where));
    if (s.type === "fitting-room") s.categories.forEach((c) => c.productIds.forEach((id) => need(productIds, id, where)));
    if (s.type === "testimonials") s.items.forEach((t) => t.productId && need(productIds, t.productId, where));
  }
  if (missing.length) throw new Error(`[client:${def.id}] unknown references:\n  ${missing.join("\n  ")}`);

  return { id: def.id, site: site.data, theme: theme.data, animation: animation.data, catalog: catalog.data };
}

const requested = process.env.NEXT_PUBLIC_CLIENT ?? "maison-studio";
if (!(requested in registry)) {
  throw new Error(`Unknown NEXT_PUBLIC_CLIENT "${requested}". Available: ${CLIENT_IDS.join(", ")}`);
}

export const activeClient: ResolvedClient = resolveClient(registry[requested as ClientId]);

// ---- Catalog lookups (server-side) ----
const productMap = new Map(activeClient.catalog.products.map((p) => [p.id, p]));
const lookMap = new Map(activeClient.catalog.looks.map((l) => [l.id, l]));
const collectionMap = new Map(activeClient.catalog.collections.map((c) => [c.slug, c]));

export const getProduct = (id: string): Product => productMap.get(id)!;
export const getProducts = (ids: string[]): Product[] => ids.map(getProduct);
export const getLooks = (ids: string[]): Look[] => ids.map((id) => lookMap.get(id)!);
export const getCollections = (slugs: string[]): Collection[] => slugs.map((s) => collectionMap.get(s)!);
