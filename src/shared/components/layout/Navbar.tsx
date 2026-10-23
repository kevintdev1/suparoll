"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Link, type LinkTone } from "@/shared/components/ui/Link";
import { useElementInView } from "@/shared/hooks/useElementInView";
import { useFocusWithin } from "@/shared/hooks/useFocusWithin";
import { useScrollDirection } from "@/shared/hooks/useScrollDirection";
import { useScrollProgress } from "@/shared/hooks/useScrollProgress";
import { useSectionTheme } from "@/shared/hooks/useSectionTheme";
import { gsap } from "@/shared/lib/motion/gsap";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";
import { lockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease } from "@/shared/lib/motion/tokens";

export type NavbarLink = {
  label: string;
  href: string;
};

export type NavbarLabels = {
  primaryNav: string;
  mobileNav: string;
  menu: string;
  openMenu: string;
  closeMenu: string;
};

type NavbarProps = {
  brand: string;
  links: NavbarLink[];
  labels: NavbarLabels;
  cartSlot?: ReactNode;
};

const ICON_BUTTON =
  "inline-flex size-11 items-center justify-center rounded-full border border-current/30 focus-visible:focus-ring";

export function Navbar(props: NavbarProps) {
  const pathname = usePathname();

  return <NavbarContent key={pathname} pathname={pathname} {...props} />;
}

function NavbarContent({
  brand,
  links,
  labels,
  cartSlot,
  pathname,
}: NavbarProps & { pathname: string }) {
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const direction = useScrollDirection();
  const heroVisible = useElementInView("hero");
  const theme = useSectionTheme();
  const focusInside = useFocusWithin(headerRef);
  useScrollProgress(progressRef);

  const hidden = direction === "down" && !heroVisible && !focusInside;

  useEffect(() => {
    gsap.to(headerRef.current, {
      yPercent: hidden ? -100 : 0,
      duration: window.matchMedia(MOTION_REDUCED).matches ? 0 : dur.base,
      ease: ease.out,
      overwrite: "auto",
    });
  }, [hidden]);

  useEffect(() => {
    const dialog = menuRef.current;

    if (!dialog || !menuOpen) {
      return;
    }

    dialog.showModal();
    const release = lockScroll();

    return () => {
      release();
      dialog.close();
    };
  }, [menuOpen]);

  const linkTone: LinkTone = theme === "dark" ? "inverse" : "ink";
  const mutedTone: LinkTone = theme === "dark" ? "inverse-muted" : "muted";

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-70 will-change-transform"
      >
        <div
          className={`content-max page-margin flex h-16 items-center justify-between ${theme === "dark" ? "text-paper" : "text-ink"}`}
        >
          <Link
            href="/"
            tone={linkTone}
            className="inline-flex min-h-11 items-center font-display text-body"
          >
            {brand}
          </Link>

          <nav
            aria-label={labels.primaryNav}
            className="hidden items-center gap-8 md:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                tone={mutedTone}
                aria-current={pathname === link.href ? "page" : undefined}
                className="inline-flex min-h-11 items-center font-mono-label aria-[current=page]:text-current"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {cartSlot}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              className={`${ICON_BUTTON} md:hidden`}
            >
              <Menu aria-hidden="true" className="size-5" />
              <span className="sr-only">{labels.openMenu}</span>
            </button>
          </div>
        </div>

        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-shutter"
        />
      </header>

      <dialog
        ref={menuRef}
        id={menuId}
        aria-label={labels.menu}
        className="dialog-full"
        onClose={() => setMenuOpen(false)}
      >
        <div className="size-full overflow-y-auto bg-paper text-ink">
          <div className="page-margin flex h-16 items-center justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={ICON_BUTTON}
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">{labels.closeMenu}</span>
            </button>
          </div>
          <nav
            aria-label={labels.mobileNav}
            className="page-margin mt-16 flex flex-col gap-6"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                className="font-display text-h2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </dialog>
    </>
  );
}
