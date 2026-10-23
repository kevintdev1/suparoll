import type { Metadata } from "next";
import { site } from "@/content/site";
import { SupportOverview } from "@/features/support";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.soporte.title,
  description: site.seo.soporte.description,
};

export default function SoportePage() {
  return (
    <main id={MAIN_CONTENT_ID} className="content-max page-margin py-24">
      <SupportOverview />
    </main>
  );
}
