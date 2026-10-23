"use client";

import { useMemo } from "react";
import { commerceContent } from "@/content/commerce";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { OrderSnapshot } from "@/features/commerce/components/OrderSnapshot";
import { loadOrder, summarizeLines } from "@/features/commerce/lib";
import { Link } from "@/shared/components/ui/Link";
import { useHydrated } from "@/shared/hooks/useHydrated";

export function ConfirmationView() {
  const hydrated = useHydrated();
  const order = useMemo(() => (hydrated ? loadOrder() : null), [hydrated]);
  const copy = commerceContent.confirmation;

  if (!hydrated) {
    return (
      <p className="text-body text-ink-2">{commerceContent.cart.loading}</p>
    );
  }

  if (!order) {
    return (
      <>
        <h1 className="font-display text-h2 text-ink">{copy.title}</h1>
        <p className="mt-6 text-body text-ink-2">{copy.empty}</p>
        <div className="mt-8">
          <Link href="/camara">{commerceContent.cart.emptyCta}</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <p className="font-mono-label text-ink-2">
        {copy.orderNumber} {order.orderId}
      </p>
      <h1 className="mt-4 font-display text-h2 text-ink">{copy.title}</h1>
      <p className="mt-4 text-body text-ink-2">
        {copy.thanks.replace("{name}", order.contactName)}
      </p>

      <div className="mt-12">
        <OrderSnapshot
          assetId={copy.snapshotAssetId}
          fallbackAlt={copy.snapshotAlt}
        />
      </div>

      <div className="mt-12">
        <CartSummary cart={summarizeLines(order.lines)} />
      </div>

      <div className="mt-10">
        <Link href="/">{copy.continueExploring}</Link>
      </div>
    </>
  );
}
