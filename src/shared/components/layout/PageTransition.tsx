"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { gsap } from "@/shared/lib/motion/gsap";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";
import {
  focusPageHeading,
  killDetachedScrollTriggers,
  killPageScrollTriggers,
  refreshScrollTriggers,
  resetScroll,
} from "@/shared/lib/motion/navigation-cleanup";
import { dur, ease } from "@/shared/lib/motion/tokens";
import {
  isInternalHref,
  normalizePath,
  type PageLabels,
  resolvePageLabel,
} from "@/shared/lib/navigation";

type PageTransitionContextValue = {
  navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

export function usePageTransition(): PageTransitionContextValue | null {
  return use(PageTransitionContext);
}

type PageTransitionProviderProps = {
  children: ReactNode;
  labels: PageLabels;
};

function runTimeline(
  build: (tl: ReturnType<typeof gsap.timeline>) => void,
): Promise<void> {
  return new Promise((resolve) => {
    const tl = gsap.timeline({ onComplete: () => resolve() });
    build(tl);
  });
}

export function PageTransitionProvider({
  children,
  labels,
}: PageTransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);
  const coveredRef = useRef(false);
  const previousPathRef = useRef(pathname);
  const [active, setActive] = useState(false);

  const animateCover = useCallback(async (label: string) => {
    const panel = panelRef.current;
    const labelEl = labelRef.current;

    if (!panel || !labelEl) {
      return;
    }

    setActive(true);
    coveredRef.current = true;
    labelEl.textContent = label;
    gsap.set(panel, { yPercent: 100, autoAlpha: 1 });
    gsap.set(labelEl, { autoAlpha: 0, y: 16 });

    await runTimeline((tl) => {
      tl.to(panel, { yPercent: 0, duration: dur.page, ease: ease.inOut }).to(
        labelEl,
        { autoAlpha: 1, y: 0, duration: dur.base, ease: ease.out },
        "-=0.4",
      );
    });
  }, []);

  const animateReveal = useCallback(async () => {
    const panel = panelRef.current;

    if (panel && coveredRef.current) {
      await runTimeline((tl) => {
        tl.to(panel, { yPercent: -100, duration: dur.page, ease: ease.inOut });
      });
      gsap.set(panel, { autoAlpha: 0, clearProps: "transform" });
    }

    coveredRef.current = false;
    setActive(false);
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      const path = normalizePath(href);

      if (busyRef.current || path === pathname) {
        return;
      }

      busyRef.current = true;

      if (!window.matchMedia(MOTION_REDUCED).matches) {
        await animateCover(resolvePageLabel(labels, href));
      }

      killPageScrollTriggers();
      router.push(href);
    },
    [animateCover, labels, pathname, router],
  );

  useEffect(() => {
    if (previousPathRef.current === pathname) {
      return;
    }

    previousPathRef.current = pathname;
    killDetachedScrollTriggers();
    resetScroll();
    refreshScrollTriggers();

    const finish = async () => {
      await animateReveal();
      focusPageHeading();
      busyRef.current = false;
    };

    void finish();
  }, [pathname, animateReveal]);

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <PageTransitionContext value={value}>
      {children}
      <div
        ref={panelRef}
        aria-hidden={!active}
        className="pointer-events-none invisible fixed inset-0 z-200 flex items-center justify-center bg-ink"
      >
        <p ref={labelRef} className="font-display text-h2 text-paper" />
      </div>
    </PageTransitionContext>
  );
}

export function shouldTransitionHref(href: string): boolean {
  return isInternalHref(href) && !normalizePath(href).startsWith("/checkout");
}
