import "server-only";
import { activeClient } from "@/clients";

/**
 * Active-client config entry points. Components import from here, never from a client folder,
 * so switching NEXT_PUBLIC_CLIENT re-skins the whole store.
 */
export const siteConfig = activeClient.site;
export const themeConfig = activeClient.theme;
export const animationConfig = activeClient.animation;
export const navigationConfig = activeClient.site.navigation;

export const previewEnabled =
  siteConfig.features.previewPanel && process.env.NEXT_PUBLIC_PREVIEW_PANEL !== "false";
