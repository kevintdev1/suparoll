import type { Metadata } from "next";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: site.seo.carrito.title,
  description: site.seo.carrito.description,
};

export default function CarritoPage() {
  return (
    <PagePlaceholder
      title="Carrito"
      description={`Fallback sin JavaScript. Drawer global en prompt 08. ${site.microcopy.emptyCart}`}
    />
  );
}
