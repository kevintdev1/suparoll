import type { Metadata } from "next";
import { site } from "@/content/site";
import { SmoothScroll } from "@/shared/components/layout/SmoothScroll";
import { Grain } from "@/shared/components/ui/Grain";
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
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
