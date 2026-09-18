"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "@/shared/lib/motion/gsap";
import {
  focusPageHeading,
  killPageScrollTriggers,
  refreshScrollTriggers,
  resetScroll,
} from "@/shared/lib/motion/navigation-cleanup";
import { dur, ease } from "@/shared/lib/motion/tokens";
import {
  getPageLabel,
  isInternalHref,
  normalizePath,
} from "@/shared/lib/navigation";

type PageTransitionContextValue = {
  navigate: (href: string, label?: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(
  null,
);

export function usePageTransition(): PageTransitionContextValue | null {
  return use(PageTransitionContext);
}

type PageTransitionProviderProps = {
  children: ReactNode;
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
}: PageTransitionProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const busyRef = useRef(false);
  const pendingPathRef = useRef<string | null>(null);
  const [active, setActive] = useState(false);

  const animateCover = useCallback(async (label: string) => {
    const panel = panelRef.current;
    const labelEl = labelRef.current;

    if (!panel) {
      return;
    }

    setActive(true);

    if (labelEl) {
      labelEl.textContent = label;
    }

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

    if (!panel) {
      setActive(false);
      return;
    }

    await runTimeline((tl) => {
      tl.to(panel, {
        yPercent: -100,
        duration: dur.page,
        ease: ease.inOut,
      });
    });

    gsap.set(panel, { autoAlpha: 0, clearProps: "transform" });
    setActive(false);
  }, []);

  const navigate = useCallback(
    async (href: string, label?: string) => {
      if (busyRef.current) {
        return;
      }

      const path = normalizePath(href);

      if (path === pathname) {
        return;
      }

      busyRef.current = true;
      pendingPathRef.current = path;

      await animateCover(label ?? getPageLabel(href));
      killPageScrollTriggers();
      router.push(href);
    },
    [animateCover, pathname, router],
  );

  useEffect(() => {
    if (!pendingPathRef.current || pathname !== pendingPathRef.current) {
      return;
    }

    pendingPathRef.current = null;

    const finish = async () => {
      resetScroll();
      refreshScrollTriggers();
      await animateReveal();
      focusPageHeading();
      busyRef.current = false;
    };

    void finish();
  }, [pathname, animateReveal]);

  useEffect(() => {
    const onPopState = () => {
      killPageScrollTriggers();
      resetScroll();
      requestAnimationFrame(() => {
        refreshScrollTriggers();
        focusPageHeading();
      });
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <PageTransitionContext value={{ navigate }}>
      {children}
      <div
        ref={panelRef}
        aria-hidden={!active}
        className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center bg-ink opacity-0"
      >
        <p ref={labelRef} className="font-display text-h2 text-paper" />
      </div>
    </PageTransitionContext>
  );
}

export function shouldTransitionHref(href: string): boolean {
  if (!isInternalHref(href)) {
    return false;
  }

  const path = normalizePath(href);

  if (path.startsWith("/checkout")) {
    return false;
  }

  return true;
}
