import type { z } from "zod";
import type { animationConfigSchema } from "@/config/schema/animation";
import type { catalogSchema } from "@/config/schema/catalog";
import type { siteConfigSchema } from "@/config/schema/site";
import type { Theme } from "@/config/schema/theme";

/** Everything a client store needs. Authored as plain objects, validated at build time. */
export type ClientDefinition = {
  id: string;
  site: z.input<typeof siteConfigSchema>;
  theme: Theme;
  animation: z.input<typeof animationConfigSchema>;
  catalog: z.input<typeof catalogSchema>;
};

export const defineClient = (client: ClientDefinition) => client;
export const defineSite = (site: ClientDefinition["site"]) => site;
export const defineAnimation = (animation: ClientDefinition["animation"]) => animation;
