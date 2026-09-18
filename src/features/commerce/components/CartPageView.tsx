"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { CartLine } from "@/features/commerce/components/CartLine";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { useCart } from "@/features/commerce/hooks/useCart";
import { Link } from "@/shared/components/ui/Link";

export function CartPageView() {
  const { cart, status, error } = useCart();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-[clamp(16px,3vw,40px)] py-24">
      <h1 className="font-display text-h2 text-ink">{site.navbar.cartLabel}</h1>

      {!ready ? (
        <p className="mt-8 text-body text-ink-2">
          {site.microcopy.loadingCart}
        </p>
      ) : null}

      {ready && status === "error" && error ? (
        <p className="mt-8 text-body text-shutter" role="alert">
          {error}
        </p>
      ) : null}

      {ready && cart.lines.length === 0 ? (
        <div className="mt-8 space-y-4">
          <p className="text-body text-ink-2">{site.microcopy.emptyCart}</p>
          <Link href="/camara">{site.microcopy.emptyCartCta}</Link>
        </div>
      ) : null}

      {ready && cart.lines.length > 0 ? (
        <div className="mt-10">
          {cart.lines.map((line) => (
            <CartLine key={line.id} line={line} />
          ))}
          <div className="mt-8 space-y-4">
            <CartSummary cart={cart} />
            <NextLink
              href="/checkout"
              className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-pill bg-ink px-8 text-center text-small font-medium text-paper focus-visible:focus-ring"
            >
              {site.microcopy.checkout}
            </NextLink>
          </div>
        </div>
      ) : null}
    </main>
  );
}
