import type { Metadata } from "next";
import { site } from "@/content/site";
import { CartDrawer } from "@/features/commerce/components/CartDrawer";
import { CartProvider } from "@/features/commerce/components/CartProvider";
import { CustomCursor } from "@/shared/components/layout/CustomCursor";
import { Navbar } from "@/shared/components/layout/Navbar";
import { PageTransitionProvider } from "@/shared/components/layout/PageTransition";
import { SmoothScroll } from "@/shared/components/layout/SmoothScroll";
import { Grain } from "@/shared/components/ui/Grain";
import { ToastProvider } from "@/shared/components/ui/Toast";
import { fontVariables } from "@/shared/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: site.seo.home.title,
  description: site.seo.home.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fontVariables} js h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <noscript>
          <style>{`html.js [data-reveal]{visibility:visible!important}`}</style>
        </noscript>
        <Grain />
        <ToastProvider>
          <CartProvider>
            <PageTransitionProvider>
              <Navbar />
              <CustomCursor />
              <CartDrawer />
              <SmoothScroll>{children}</SmoothScroll>
            </PageTransitionProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
