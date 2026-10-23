import type { Metadata } from "next";
import { commerceContent } from "@/content/commerce";
import { site } from "@/content/site";
import { CartPageView } from "@/features/commerce";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.carrito.title,
  description: site.seo.carrito.description,
};

export default function CarritoPage() {
  return (
    <main id={MAIN_CONTENT_ID} className="page-margin mx-auto max-w-3xl py-24">
      <h1 data-page-title className="font-display text-h2 text-ink">
        {commerceContent.cart.title}
      </h1>
      <CartPageView />
    </main>
  );
}
