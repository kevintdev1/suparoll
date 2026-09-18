import type { Metadata } from "next";
import { getFaqByTag } from "@/content/faq";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: site.seo.soporte.title,
  description: site.seo.soporte.description,
};

export default function SoportePage() {
  const faqItems = getFaqByTag("support");

  return (
    <PagePlaceholder
      title="¿En qué podemos ayudarte?"
      description="FAQ, envíos, devoluciones, garantía y contacto."
      sections={[
        ...faqItems.map((item) => ({ id: item.id, title: item.question })),
        { id: "shipping", title: "[[PENDIENTE: política de envío]]" },
        { id: "returns", title: "[[PENDIENTE: política de devoluciones]]" },
        { id: "warranty", title: "[[PENDIENTE: garantía]]" },
        { id: "contact", title: "[[PENDIENTE: contacto]]" },
      ]}
    />
  );
}
