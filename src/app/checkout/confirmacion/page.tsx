import type { Metadata } from "next";
import { site } from "@/content/site";
import { ConfirmationView } from "@/features/commerce";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.confirmacion.title,
  description: site.seo.confirmacion.description,
};

export default function ConfirmacionPage() {
  return (
    <main id={MAIN_CONTENT_ID} className="page-margin mx-auto max-w-2xl py-24">
      <ConfirmationView />
    </main>
  );
}
