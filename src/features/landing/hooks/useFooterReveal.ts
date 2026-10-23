import { type RefObject, useEffect, useState } from "react";
import { MEDIA_DESKTOP } from "@/shared/lib/motion/media";
import { getLenis } from "@/shared/lib/motion/scroller";

function scrollToEnd(): void {
  const lenis = getLenis();

  if (lenis) {
    lenis.scrollTo(lenis.limit, { immediate: true });
    return;
  }

  window.scrollTo({ top: document.documentElement.scrollHeight });
}

export function useFooterReveal(
  footerRef: RefObject<HTMLElement | null>,
): number {
  const [revealHeight, setRevealHeight] = useState(0);

  useEffect(() => {
    const footer = footerRef.current;

    if (!footer) {
      return;
    }

    const desktop = window.matchMedia(MEDIA_DESKTOP);
    let fixed = false;

    const update = () => {
      const height = footer.offsetHeight;
      fixed = desktop.matches && height <= window.innerHeight;
      setRevealHeight(fixed ? height : 0);
    };

    const onFocusIn = () => {
      const scrolledToEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 1;

      if (fixed && !scrolledToEnd) {
        scrollToEnd();
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(footer);
    desktop.addEventListener("change", update);
    window.addEventListener("resize", update);
    footer.addEventListener("focusin", onFocusIn);

    return () => {
      observer.disconnect();
      desktop.removeEventListener("change", update);
      window.removeEventListener("resize", update);
      footer.removeEventListener("focusin", onFocusIn);
    };
  }, [footerRef]);

  return revealHeight;
}
