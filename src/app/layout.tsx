import type { Metadata } from "next";
import { site } from "@/content/site";
import { CartDrawer, CartProvider, CartTrigger } from "@/features/commerce";
import { CustomCursor } from "@/shared/components/layout/CustomCursor";
import { Navbar } from "@/shared/components/layout/Navbar";
import { PageTransitionProvider } from "@/shared/components/layout/PageTransition";
import { SmoothScroll } from "@/shared/components/layout/SmoothScroll";
import { Grain } from "@/shared/components/ui/Grain";
import { ToastProvider } from "@/shared/components/ui/Toast";
import { fontVariables } from "@/shared/lib/fonts";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: site.seo.home.title,
  description: site.seo.home.description,
};

const navbarLabels = {
  primaryNav: site.navbar.primaryNavLabel,
  mobileNav: site.navbar.mobileNavLabel,
  menu: site.navbar.menuLabel,
  openMenu: site.navbar.openMenu,
  closeMenu: site.navbar.closeMenu,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fontVariables} js antialiased`}>
      <body className="flex min-h-svh flex-col">
        <noscript>
          <style>{`html.js [data-reveal]{visibility:visible!important}`}</style>
        </noscript>
        <a
          href={`#${MAIN_CONTENT_ID}`}
          className="sr-only rounded-pill bg-ink px-4 py-3 text-small text-paper focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-300 focus-visible:focus-ring"
        >
          {site.skipToContent}
        </a>
        <Grain />
        <ToastProvider dismissLabel={site.microcopy.dismissToast}>
          <CartProvider>
            <PageTransitionProvider labels={site.pageLabels}>
              <Navbar
                brand={site.brand}
                links={site.navbar.links}
                labels={navbarLabels}
                cartSlot={<CartTrigger />}
              />
              <CustomCursor labels={site.cursorLabels} />
              <CartDrawer />
              <SmoothScroll>{children}</SmoothScroll>
            </PageTransitionProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
