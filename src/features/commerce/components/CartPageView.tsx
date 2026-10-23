"use client";

import { commerceContent } from "@/content/commerce";
import { CartLineList } from "@/features/commerce/components/CartLineList";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { useCart } from "@/features/commerce/hooks/useCart";
import { ButtonLink } from "@/shared/components/ui/ButtonLink";
import { Link } from "@/shared/components/ui/Link";
import { useHydrated } from "@/shared/hooks/useHydrated";
import { focusPageHeading } from "@/shared/lib/motion/navigation-cleanup";

export function CartPageView() {
  const { cart, status, error } = useCart();
  const hydrated = useHydrated();
  const copy = commerceContent.cart;

  if (!hydrated) {
    return <p className="mt-8 text-body text-ink-2">{copy.loading}</p>;
  }

  return (
    <>
      {status === "error" && error ? (
        <p className="mt-8 text-body text-ink" role="alert">
          {error}
        </p>
      ) : null}

      {cart.lines.length === 0 ? (
        <div className="mt-8 space-y-4">
          <p className="text-body text-ink-2">{copy.empty}</p>
          <Link href="/camara">{copy.emptyCta}</Link>
        </div>
      ) : (
        <div className="mt-10">
          <CartLineList lines={cart.lines} onLineRemoved={focusPageHeading} />
          <div className="mt-8 space-y-4">
            <CartSummary cart={cart} />
            <ButtonLink variant="primary" href="/checkout" className="w-full">
              {copy.checkout}
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
