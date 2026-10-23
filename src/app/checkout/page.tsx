import type { Metadata } from "next";
import { commerceContent } from "@/content/commerce";
import { site } from "@/content/site";
import { CheckoutForm } from "@/features/commerce";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.checkout.title,
  description: site.seo.checkout.description,
};

export default function CheckoutPage() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      data-native-cursor
      className="page-margin mx-auto max-w-2xl py-24"
    >
      <h1 data-page-title className="font-display text-h2 text-ink">
        {commerceContent.checkout.title}
      </h1>
      <p className="mt-4 text-body text-ink-2">
        {commerceContent.checkout.demoNote}
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </main>
  );
}
