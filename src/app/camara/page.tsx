import type { Metadata } from "next";
import { productPageContent } from "@/content/product-page";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";

export const metadata: Metadata = {
  title: site.seo.camara.title,
  description: site.seo.camara.description,
};

export default function CamaraPage() {
  const { hero, inTheBox, specs, samplePhotos, faq, related } =
    productPageContent;

  return (
    <PagePlaceholder
      title={hero.title}
      description={hero.subtitle}
      sections={[
        { id: "purchase", title: "Galería + panel de compra sticky" },
        { id: inTheBox.id, title: inTheBox.title },
        { id: specs.id, title: specs.title },
        { id: samplePhotos.id, title: samplePhotos.title },
        { id: faq.id, title: faq.title },
        { id: related.id, title: related.title },
      ]}
    />
  );
}
