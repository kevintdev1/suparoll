"use client";

import { Menu, ShoppingBag, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { site } from "@/content/site";
import { useCart } from "@/features/commerce/hooks/useCart";
import { formatPrice } from "@/features/commerce/lib";
import { Link } from "@/shared/components/ui/Link";
import { gsap } from "@/shared/lib/motion/gsap";
import { getLenis } from "@/shared/lib/motion/scroller";
import { dur, ease } from "@/shared/lib/motion/tokens";

const SCROLL_DELTA = 8;

export function Navbar() {
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const { cart, isOpen, toggleCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hidden, setHidden] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const lastScrollRef = useRef(0);

  const count = cart.itemCount;
  const countLabel = count > 0 ? ` (${count})` : "";

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
  }, []);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    const onScroll = () => {
      const lenis = getLenis();
      const scrollY = lenis?.scroll ?? window.scrollY;
      const delta = scrollY - lastScrollRef.current;

      if (Math.abs(delta) >= SCROLL_DELTA) {
        setHidden(delta > 0 && !heroVisible);
        lastScrollRef.current = scrollY;
      }

      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const lenis = getLenis();
    lenis?.on("scroll", onScroll);

    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [heroVisible]);

  useEffect(() => {
    const hero = document.getElementById("hero");

    if (!hero) {
      setHeroVisible(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setHeroVisible(entry?.isIntersecting ?? false);
      },
      { threshold: 0.05 },
    );

    observer.observe(hero);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("[data-theme]");

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const nextTheme = visible.target.getAttribute("data-theme");

          if (nextTheme === "dark" || nextTheme === "light") {
            setTheme(nextTheme);
          }
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: [0, 0.25, 0.5],
      },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const header = headerRef.current;

    if (!header) {
      return;
    }

    gsap.to(header, {
      yPercent: hidden ? -100 : 0,
      duration: dur.base,
      ease: ease.out,
      overwrite: "auto",
    });
  }, [hidden]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const isDark = theme === "dark";
  const textClass = isDark ? "text-paper" : "text-ink";
  const mutedClass = isDark ? "text-paper/70" : "text-ink-2";
  const borderClass = isDark ? "border-paper/20" : "border-paper-2";

  return (
    <>
      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-[70] will-change-transform"
      >
        <div
          className={`mx-auto flex h-16 max-w-[1600px] items-center justify-between px-[clamp(16px,3vw,40px)] ${textClass}`}
        >
          <Link
            href="/"
            className={`font-display text-body tracking-tight ${textClass} hover:opacity-80`}
          >
            {site.brand}
          </Link>

          <nav
            aria-label="Principal"
            className="hidden items-center gap-8 md:flex"
          >
            {site.navbar.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-mono text-label uppercase tracking-wider transition-colors ${mutedClass} ${isDark ? "hover:text-paper" : "hover:text-ink"}`}
              >
                {link.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={toggleCart}
              aria-expanded={isOpen}
              aria-controls="cart-drawer"
              className={`inline-flex items-center gap-2 rounded-pill border ${borderClass} px-4 py-2 ${textClass} focus-visible:focus-ring`}
            >
              <ShoppingBag aria-hidden="true" className="size-4" />
              <span className="font-mono text-label uppercase tracking-wider">
                {site.navbar.cartLabel}
                <span data-cart-count>{countLabel}</span>
              </span>
              <span className="sr-only">
                {count > 0
                  ? `${count} ${count === 1 ? "artículo" : "artículos"}. Total ${formatPrice(cart.total, cart.lines[0]?.currency ?? null)}`
                  : site.microcopy.emptyCart}
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={toggleCart}
              aria-expanded={isOpen}
              aria-controls="cart-drawer"
              className={`inline-flex size-10 items-center justify-center rounded-full border ${borderClass} ${textClass} focus-visible:focus-ring`}
            >
              <ShoppingBag aria-hidden="true" className="size-4" />
              <span className="sr-only">
                {site.navbar.cartLabel}
                {countLabel}
              </span>
            </button>

            <button
              type="button"
              onClick={menuOpen ? closeMenu : openMenu}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              className={`inline-flex size-10 items-center justify-center rounded-full border ${borderClass} ${textClass} focus-visible:focus-ring`}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="size-5" />
              ) : (
                <Menu aria-hidden="true" className="size-5" />
              )}
              <span className="sr-only">
                {menuOpen ? "Cerrar menú" : "Abrir menú"}
              </span>
            </button>
          </div>
        </div>

        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-shutter"
        />
      </header>

      {menuOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-[80] flex flex-col bg-paper px-[clamp(16px,3vw,40px)] py-24"
        >
          <nav aria-label="Menú móvil" className="mt-16 flex flex-col gap-6">
            {site.navbar.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="font-display text-h2 text-ink focus-visible:focus-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
