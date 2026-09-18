import type { Metadata } from "next";
import { site } from "@/content/site";
import { ConfirmationView } from "@/features/commerce/components/ConfirmationView";

export const metadata: Metadata = {
  title: site.seo.confirmacion.title,
  description: site.seo.confirmacion.description,
};

export default function ConfirmacionPage() {
  return <ConfirmationView />;
}
