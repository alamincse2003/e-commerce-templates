import type { Metadata, Viewport } from "next";
import { AnimationProvider } from "@/animations/animation-provider";
import { LenisProvider } from "@/animations/lenis-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SiteProvider } from "@/components/providers/site-provider";
import { fontVariables } from "@/config/fonts";
import { animationConfig, previewEnabled, siteConfig, themeConfig } from "@/config/site.config";
import { PreviewLoader } from "@/preview/preview-loader";
import { StoreHydrator } from "@/store/store-hydrator";
import { ThemeHead } from "@/theme/theme-head";
import "./globals.css";

export const metadata: Metadata = {
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  icons: siteConfig.brand.favicon ? { icon: siteConfig.brand.favicon } : undefined,
};

export const viewport: Viewport = {
  themeColor: themeConfig.colors.background,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const site = {
    brandName: siteConfig.brand.name,
    commerce: { ...siteConfig.commerce },
  };

  return (
    // The boot script may set inline CSS vars / data-motion on <html> before hydration.
    <html lang={siteConfig.locale ?? "en"} className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeHead theme={themeConfig} animationsEnabled={animationConfig.enabled} previewEnabled={previewEnabled} />
      </head>
      <body id="top">
        <SiteProvider value={site}>
          <AnimationProvider base={animationConfig}>
            <LenisProvider>
              <StoreHydrator preview={previewEnabled} />
              <a href="#main" className="type-caps sr-only z-[100] bg-background px-4 py-3 focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
                Skip to content
              </a>
              {siteConfig.announcement.enabled ? <AnnouncementBar messages={siteConfig.announcement.messages} /> : null}
              <Header wordmark={siteConfig.brand.wordmark} logo={siteConfig.brand.logo} links={siteConfig.navigation.primary} />
              <main id="main">{children}</main>
              <Footer site={siteConfig} />
              <CartDrawer />
              {previewEnabled ? <PreviewLoader clientTheme={themeConfig} clientName={siteConfig.brand.name} /> : null}
            </LenisProvider>
          </AnimationProvider>
        </SiteProvider>
      </body>
    </html>
  );
}
