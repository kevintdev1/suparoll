"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { CartLine } from "@/features/commerce/components/CartLine";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { useCart } from "@/features/commerce/hooks/useCart";
import { Button } from "@/shared/components/ui/Button";
import { Link } from "@/shared/components/ui/Link";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { lockScroll, unlockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease, stagger } from "@/shared/lib/motion/tokens";

export function CartDrawer() {
  const { cart, status, error, isOpen, closeCart, clearError } = useCart();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);
  const closeCartRef = useRef(closeCart);
  const previousPathname = useRef(pathname);
  closeCartRef.current = closeCart;

  useEffect(() => {
    if (previousPathname.current === pathname) {
      return;
    }

    previousPathname.current = pathname;
    closeCartRef.current();
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeCartRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }

      lockScroll();
      document.documentElement.style.overflow = "hidden";
      return;
    }

    const closeLater = window.setTimeout(
      () => {
        if (dialog.open) {
          dialog.close();
        }

        document.documentElement.style.overflow = "";
        unlockScroll();
      },
      dur.base * 1000 + 80,
    );

    return () => window.clearTimeout(closeLater);
  }, [isOpen]);

  useGSAP(
    () => {
      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const panel = dialog.querySelector<HTMLElement>(
        '[data-anim="cart-panel"]',
      );
      const scrim = dialog.querySelector<HTMLElement>(
        '[data-anim="cart-scrim"]',
      );
      const lines = dialog.querySelectorAll<HTMLElement>(
        '[data-anim="cart-line"]',
      );

      if (!panel || !scrim) {
        return;
      }

      const mm = gsap.matchMedia();
      const closeAndRestore = () => {
        if (dialog.open) {
          dialog.close();
        }

        document.documentElement.style.overflow = "";
        unlockScroll();

        const opener = openerRef.current;
        if (opener) {
          opener.focus();
        }
      };

      const playOpen = (slide: boolean) => {
        if (
          typeof document !== "undefined" &&
          document.activeElement instanceof HTMLElement
        ) {
          openerRef.current = document.activeElement;
        }

        if (!dialog.open) {
          dialog.showModal();
        }

        lockScroll();
        document.documentElement.style.overflow = "hidden";

        if (!slide) {
          gsap.set(panel, { xPercent: 0 });
          gsap.set(scrim, { opacity: 1 });
          gsap.set(lines, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(panel, { xPercent: 100 });
        gsap.set(scrim, { opacity: 0 });
        gsap.set(lines, { opacity: 0, y: 12 });

        const tl = gsap.timeline();
        tl.to(scrim, { opacity: 1, duration: dur.base, ease: ease.inOut }, 0);
        tl.to(panel, { xPercent: 0, duration: dur.base, ease: ease.inOut }, 0);
        tl.to(
          lines,
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

      const playClose = (slide: boolean) => {
        if (!slide) {
          closeAndRestore();
          return;
        }

        const tl = gsap.timeline({ onComplete: closeAndRestore });
        tl.to(lines, { opacity: 0, duration: dur.micro, ease: ease.inOut }, 0);
        tl.to(
          panel,
          { xPercent: 100, duration: dur.base, ease: ease.inOut },
          0,
        );
        tl.to(scrim, { opacity: 0, duration: dur.base, ease: ease.inOut }, 0);
      };

      mm.add(MOTION_DESKTOP, () => {
        if (isOpen) {
          playOpen(true);
        } else if (wasOpen.current || dialog.open) {
          playClose(true);
        }
      });

      mm.add(MOTION_MOBILE, () => {
        if (isOpen) {
          playOpen(true);
        } else if (wasOpen.current || dialog.open) {
          playClose(true);
        }
      });

      mm.add(MOTION_REDUCED, () => {
        if (isOpen) {
          playOpen(false);
        } else if (wasOpen.current || dialog.open) {
          playClose(false);
        }
      });

      wasOpen.current = isOpen;

      return () => {
        mm.revert();
      };
    },
    { scope: dialogRef, dependencies: [isOpen] },
  );

  return (
    <dialog
      ref={dialogRef}
      id="cart-drawer"
      aria-labelledby="cart-drawer-title"
      className="cart-dialog m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0"
      onClose={closeCart}
    >
      <div className="relative flex h-full justify-end">
        <button
          type="button"
          data-anim="cart-scrim"
          tabIndex={-1}
          className="absolute inset-0 bg-scrim"
          aria-label={site.microcopy.closeCart}
          onClick={closeCart}
        />

        <div
          data-anim="cart-panel"
          className="relative flex h-full w-full max-w-md flex-col bg-paper text-ink shadow-instant"
        >
          <header className="flex items-center justify-between border-b border-paper-2 px-6 py-5">
            <h2 id="cart-drawer-title" className="font-display text-h3">
              {site.navbar.cartLabel}
              {cart.itemCount > 0 ? ` (${cart.itemCount})` : ""}
            </h2>
            <button
              type="button"
              onClick={closeCart}
              className="font-mono text-label uppercase tracking-wider text-ink-2 focus-visible:focus-ring"
            >
              {site.microcopy.closeCart}
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {status === "error" && error ? (
              <div className="space-y-3" role="alert">
                <p className="text-body text-shutter">{error}</p>
                <Button variant="secondary" onClick={clearError}>
                  Cerrar aviso
                </Button>
              </div>
            ) : null}

            {status !== "error" && cart.lines.length === 0 ? (
              <div className="space-y-4">
                <p className="text-body text-ink-2">
                  {site.microcopy.emptyCart}
                </p>
                <Link href="/camara">{site.microcopy.emptyCartCta}</Link>
              </div>
            ) : null}

            {cart.lines.length > 0 ? (
              <div>
                {cart.lines.map((line) => (
                  <CartLine key={line.id} line={line} />
                ))}
              </div>
            ) : null}
          </div>

          {cart.lines.length > 0 ? (
            <footer className="space-y-4 border-t border-paper-2 px-6 py-5">
              <CartSummary cart={cart} />
              <a
                href="/checkout"
                className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-pill bg-ink px-8 text-center text-small font-medium text-paper no-underline focus-visible:focus-ring"
              >
                {site.microcopy.checkout}
              </a>
            </footer>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
