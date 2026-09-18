import type { Metadata } from "next";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: site.seo.privacidad.title,
  description: site.seo.privacidad.description,
};

export default function PrivacidadPage() {
  return (
    <PagePlaceholder
      title="Política de privacidad"
      description="[[PENDIENTE: política de privacidad]]"
    />
  );
}
