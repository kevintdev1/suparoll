import { type RefObject, useEffect } from "react";
import { gsap } from "@/shared/lib/motion/gsap";

export function useKeepFocusInClip(
  clipRef: RefObject<HTMLElement | null>,
  itemSelector: string,
): void {
  useEffect(() => {
    const clip = clipRef.current;

    if (!clip) {
      return;
    }

    let focused: HTMLElement | null = null;
    let frame = 0;

    const align = () => {
      frame = 0;

      const item = focused?.closest<HTMLElement>(itemSelector);

      if (!focused || !item) {
        return;
      }

      const bounds = clip.getBoundingClientRect();
      const rect = focused.getBoundingClientRect();
      const shift =
        rect.top < bounds.top
          ? bounds.top - rect.top
          : rect.bottom > bounds.bottom
            ? bounds.bottom - rect.bottom
            : 0;

      if (shift !== 0) {
        gsap.set(item, { y: `+=${shift}` });
      }
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(align);
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      focused = event.target as HTMLElement;
      align();
      window.addEventListener("scroll", schedule, { passive: true });
    };

    const onFocusOut = (event: FocusEvent) => {
      if (clip.contains(event.relatedTarget as Node | null)) {
        return;
      }

      focused = null;
      window.removeEventListener("scroll", schedule);
      gsap.set(clip.querySelectorAll(itemSelector), { y: 0 });
    };

    clip.addEventListener("focusin", onFocusIn);
    clip.addEventListener("focusout", onFocusOut);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      clip.removeEventListener("focusin", onFocusIn);
      clip.removeEventListener("focusout", onFocusOut);
    };
  }, [clipRef, itemSelector]);
}
