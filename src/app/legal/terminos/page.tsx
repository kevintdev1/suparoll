import type { Metadata } from "next";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: site.seo.terminos.title,
  description: site.seo.terminos.description,
};

export default function TerminosPage() {
  return (
    <PagePlaceholder
      title="Términos y condiciones"
      description="[[PENDIENTE: términos y condiciones]]"
    />
  );
}
