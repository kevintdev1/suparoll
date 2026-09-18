"use client";

import { ScrollTrigger } from "@/shared/lib/motion/gsap";
import { scrollToTop } from "@/shared/lib/motion/scroller";

export function killPageScrollTriggers(): number {
  const triggers = ScrollTrigger.getAll();
  const count = triggers.length;

  for (const trigger of triggers) {
    trigger.kill();
  }

  return count;
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
