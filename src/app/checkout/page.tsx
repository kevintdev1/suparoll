import type { Metadata } from "next";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: site.seo.checkout.title,
  description: site.seo.checkout.description,
};

export default function CheckoutPage() {
  return (
    <PagePlaceholder
      title="Checkout"
      description="Placeholder — flujo de compra se construye en prompt 08 (mock o backend real)."
    />
  );
}
