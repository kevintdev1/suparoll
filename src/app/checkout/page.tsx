import type { Metadata } from "next";
import { site } from "@/content/site";
import { CheckoutForm } from "@/features/commerce/components/CheckoutForm";

export const metadata: Metadata = {
  title: site.seo.checkout.title,
  description: site.seo.checkout.description,
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto w-full max-w-2xl px-[clamp(16px,3vw,40px)] py-24">
      <h1 className="font-display text-h2 text-ink">Checkout</h1>
      <p className="mt-4 text-body text-ink-2">
        {site.microcopy.checkoutDemoNote}
      </p>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </main>
  );
}
