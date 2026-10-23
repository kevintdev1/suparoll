import { commerceContent } from "@/content/commerce";
import { formatPrice, getCartCurrency } from "@/features/commerce/lib";
import type { Cart } from "@/features/commerce/types";

type CartSummaryProps = {
  cart: Cart;
};

export function CartSummary({ cart }: CartSummaryProps) {
  const currency = getCartCurrency(cart.lines);
  const { summary } = commerceContent;

  return (
    <dl className="space-y-2 text-small text-ink">
      <div className="flex justify-between gap-4">
        <dt>{summary.subtotal}</dt>
        <dd className="font-mono-label">
          {formatPrice(cart.subtotal, currency)}
        </dd>
      </div>
      <div className="flex justify-between gap-4">
        <dt>{summary.shipping}</dt>
        <dd className="text-right text-ink-2">{cart.shippingLabel}</dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-paper-2 pt-2 text-body">
        <dt>{summary.total}</dt>
        <dd className="font-mono-label">{formatPrice(cart.total, currency)}</dd>
      </div>
    </dl>
  );
}
