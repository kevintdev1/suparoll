import type { Metadata } from "next";
import { legalContent } from "@/content/legal";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.privacidad.title,
  description: site.seo.privacidad.description,
};

export default function PrivacidadPage() {
  return (
    <main id={MAIN_CONTENT_ID} className="content-max page-margin py-24">
      <PagePlaceholder
        title={legalContent.privacy.title}
        description={legalContent.privacy.description}
      />
    </main>
  );
}
