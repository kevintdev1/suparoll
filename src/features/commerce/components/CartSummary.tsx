"use client";

import { formatPrice } from "@/features/commerce/lib";
import type { Cart } from "@/features/commerce/types";

type CartSummaryProps = {
  cart: Cart;
};

export function CartSummary({ cart }: CartSummaryProps) {
  const currency = cart.lines[0]?.currency ?? null;

  return (
    <dl className="space-y-2 text-small text-ink">
      <div className="flex justify-between gap-4">
        <dt>Subtotal</dt>
        <dd className="font-mono text-label uppercase tracking-wider">
          {formatPrice(cart.subtotal, currency)}
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>Envío</dt>
        <dd className="text-right text-ink-2">{cart.shippingLabel}</dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-paper-2 pt-2 text-body">
        <dt>Total</dt>
        <dd className="font-mono text-label uppercase tracking-wider">
          {formatPrice(cart.total, currency)}
        </dd>
      </div>
    </dl>
  );
}
