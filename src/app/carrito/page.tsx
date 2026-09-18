import type { Metadata } from "next";
import { site } from "@/content/site";
import { CartPageView } from "@/features/commerce/components/CartPageView";

export const metadata: Metadata = {
  title: site.seo.carrito.title,
  description: site.seo.carrito.description,
};

export default function CarritoPage() {
  return <CartPageView />;
}
