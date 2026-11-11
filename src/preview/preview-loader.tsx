"use client";

import dynamic from "next/dynamic";
import type { Theme } from "@/config/schema/theme";
import { ThemeController } from "@/theme/theme-controller";

// The panel UI is code-split: it never loads in builds where the preview is disabled.
const CustomizationPanel = dynamic(() => import("./customization-panel"), { ssr: false });

/**
 * Development / client-demo tooling. Rendered only when `features.previewPanel` is true and
 * NEXT_PUBLIC_PREVIEW_PANEL !== "false". Delete the /preview folder to remove it entirely.
 */
export function PreviewLoader({ clientTheme, clientName }: { clientTheme: Theme; clientName: string }) {
  return (
    <>
      <ThemeController clientTheme={clientTheme} />
      <CustomizationPanel clientTheme={clientTheme} clientName={clientName} />
    </>
  );
}
