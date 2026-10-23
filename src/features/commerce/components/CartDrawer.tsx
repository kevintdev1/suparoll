"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { commerceContent } from "@/content/commerce";
import { CartLineList } from "@/features/commerce/components/CartLineList";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { CART_DRAWER_ID } from "@/features/commerce/components/cart-ids";
import { useCart } from "@/features/commerce/hooks/useCart";
import { Button } from "@/shared/components/ui/Button";
import { ButtonLink } from "@/shared/components/ui/ButtonLink";
import { Link } from "@/shared/components/ui/Link";
import { useToastHost } from "@/shared/components/ui/Toast";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_OK, MOTION_REDUCED } from "@/shared/lib/motion/media";
import { lockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease, stagger } from "@/shared/lib/motion/tokens";

const TITLE_ID = "cart-drawer-title";

export function CartDrawer() {
  const { cart, status, error, isOpen, closeCart, clearError } = useCart();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousPathname = useRef(pathname);
  const copy = commerceContent.cart;

  useToastHost(dialogRef, isOpen);

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    closeCart();
  }, [pathname, closeCart]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    return lockScroll();
  }, [isOpen]);

  useGSAP(
    () => {
      const dialog = dialogRef.current;
      const panel = dialog?.querySelector('[data-anim="cart-panel"]');
      const scrim = dialog?.querySelector('[data-anim="cart-scrim"]');

      if (!dialog || !panel || !scrim) {
        return;
      }

      const lines = dialog.querySelectorAll('[data-anim="cart-line"]');

      const open = (animate: boolean) => {
        if (!dialog.open) {
          dialog.showModal();
          closeButtonRef.current?.focus();
        }

        if (!animate) {
          return;
        }

        gsap
          .timeline()
          .fromTo(
            scrim,
            { opacity: 0 },
            { opacity: 1, duration: dur.base, ease: ease.inOut },
            0,
          )
          .fromTo(
            panel,
            { xPercent: 100 },
            { xPercent: 0, duration: dur.base, ease: ease.inOut },
            0,
          )
          .fromTo(
            lines,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: dur.base,
              stagger: stagger.items,
              ease: ease.out,
            },
            0.1,
          );
      };

      const close = (animate: boolean) => {
        if (!dialog.open) {
          return;
        }

        if (!animate) {
          dialog.close();
          return;
        }

        gsap
          .timeline({ onComplete: () => dialog.close() })
          .to(lines, { opacity: 0, duration: dur.micro, ease: ease.inOut }, 0)
          .to(panel, { xPercent: 100, duration: dur.base, ease: ease.inOut }, 0)
          .to(scrim, { opacity: 0, duration: dur.base, ease: ease.inOut }, 0);
      };

      const sync = (animate: boolean) => {
        if (isOpen) {
          open(animate);
        } else {
          close(animate);
        }
      };

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => sync(true));
      mm.add(MOTION_REDUCED, () => sync(false));

      return () => mm.revert();
    },
    { scope: dialogRef, dependencies: [isOpen] },
  );

  return (
    <dialog
      ref={dialogRef}
      id={CART_DRAWER_ID}
      aria-labelledby={TITLE_ID}
      className="dialog-full"
      onCancel={(event) => {
        event.preventDefault();
        closeCart();
      }}
      onClose={closeCart}
    >
      <div className="flex h-full justify-end">
        <button
          type="button"
          data-anim="cart-scrim"
          tabIndex={-1}
          className="absolute inset-0 bg-scrim"
          aria-label={copy.close}
          onClick={closeCart}
        />

        <div
          data-anim="cart-panel"
          className="relative flex size-full max-w-md flex-col bg-paper text-ink shadow-instant"
        >
          <div className="flex items-center justify-between border-b border-paper-2 py-3 pr-3 pl-6">
            <h2
              ref={titleRef}
              id={TITLE_ID}
              tabIndex={-1}
              className="font-display text-h3"
            >
              {copy.title}
              {cart.itemCount > 0 ? ` (${cart.itemCount})` : ""}
            </h2>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeCart}
              className="inline-flex size-11 items-center justify-center text-ink-2 hover:text-ink focus-visible:focus-ring"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">{copy.close}</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {status === "error" && error ? (
              <div className="space-y-3" role="alert">
                <p className="text-body text-ink">{error}</p>
                <Button variant="secondary" onClick={clearError}>
                  {copy.dismissError}
                </Button>
              </div>
            ) : null}

            {status !== "error" && cart.lines.length === 0 ? (
              <div className="space-y-4">
                <p className="text-body text-ink-2">{copy.empty}</p>
                <Link href="/camara" onClick={closeCart}>
                  {copy.emptyCta}
                </Link>
              </div>
            ) : null}

            {cart.lines.length > 0 ? (
              <CartLineList
                lines={cart.lines}
                onLineRemoved={() => titleRef.current?.focus()}
              />
            ) : null}
          </div>

          {cart.lines.length > 0 ? (
            <div className="space-y-4 border-t border-paper-2 px-6 py-5">
              <CartSummary cart={cart} />
              <ButtonLink variant="primary" href="/checkout" className="w-full">
                {copy.checkout}
              </ButtonLink>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
