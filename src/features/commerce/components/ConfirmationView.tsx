"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { OrderSnapshot } from "@/features/commerce/components/OrderSnapshot";
import { loadOrder } from "@/features/commerce/lib";
import type { SimulatedOrder } from "@/features/commerce/types";
import { Link } from "@/shared/components/ui/Link";

const SNAPSHOT_ASSET_ID = "develop-photo";

export function ConfirmationView() {
  const [order, setOrder] = useState<SimulatedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setOrder(loadOrder());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <main className="mx-auto max-w-2xl px-[clamp(16px,3vw,40px)] py-24">
        <p className="text-body text-ink-2">{site.microcopy.loadingCart}</p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-2xl px-[clamp(16px,3vw,40px)] py-24">
        <h1 className="font-display text-h2 text-ink">
          {site.microcopy.confirmationTitle}
        </h1>
        <p className="mt-6 text-body text-ink-2">
          {site.microcopy.confirmationEmpty}
        </p>
        <div className="mt-8">
          <Link href="/camara">{site.microcopy.emptyCartCta}</Link>
        </div>
      </main>
    );
  }

  const cartView = {
    lines: order.lines,
    itemCount: order.lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal: order.subtotal,
    shippingStatus: "pending" as const,
    shippingLabel: order.shippingLabel,
    total: order.subtotal,
  };

  return (
    <main className="mx-auto max-w-2xl px-[clamp(16px,3vw,40px)] py-24">
      <p className="font-mono text-label uppercase tracking-wider text-ink-2">
        {site.microcopy.orderNumber} {order.orderId}
      </p>
      <h1 className="mt-4 font-display text-h2 text-ink">
        {site.microcopy.confirmationTitle}
      </h1>
      <p className="mt-4 text-body text-ink-2">
        Gracias, {order.contactName}. Esto es una confirmación de demostración.
      </p>

      <div className="mt-12">
        <OrderSnapshot assetId={SNAPSHOT_ASSET_ID} />
      </div>

      <div className="mt-12">
        <CartSummary cart={cartView} />
      </div>

      <div className="mt-10">
        <Link href="/">{site.microcopy.continueExploring}</Link>
      </div>
    </main>
  );
}
