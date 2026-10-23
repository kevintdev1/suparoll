import { ScrollTrigger } from "@/shared/lib/motion/gsap";
import { scrollToTop } from "@/shared/lib/motion/scroller";

export function killPageScrollTriggers(): void {
  for (const trigger of ScrollTrigger.getAll()) {
    trigger.kill();
  }
}

export function killDetachedScrollTriggers(): void {
  for (const trigger of ScrollTrigger.getAll()) {
    if (trigger.trigger && !trigger.trigger.isConnected) {
      trigger.kill();
    }
  }
}

export function resetScroll(): void {
  scrollToTop({ immediate: true });
}

export function focusPageHeading(): void {
  const target = document.querySelector<HTMLElement>("[data-page-title], h1");

  if (!target) {
    return;
  }

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }

  target.focus({ preventScroll: true });
}

export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}
