import type { Metadata } from "next";
import { legalContent } from "@/content/legal";
import { site } from "@/content/site";
import { PagePlaceholder } from "@/shared/components/layout/PagePlaceholder";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.terminos.title,
  description: site.seo.terminos.description,
};

export default function TerminosPage() {
  return (
    <main id={MAIN_CONTENT_ID} className="content-max page-margin py-24">
      <PagePlaceholder
        title={legalContent.terms.title}
        description={legalContent.terms.description}
      />
    </main>
  );
}
