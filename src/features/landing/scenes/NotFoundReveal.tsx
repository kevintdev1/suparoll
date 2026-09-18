"use client";

import { useRef } from "react";
import { site } from "@/content/site";
import { ButtonLink } from "@/shared/components/ui/ButtonLink";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_DESKTOP, MOTION_REDUCED } from "@/shared/lib/motion/media";
import { dur, ease } from "@/shared/lib/motion/tokens";

export function NotFoundReveal() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { notFoundTitle, notFoundBody, notFoundCta } = site.microcopy;

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const revealEl = root.querySelector<HTMLElement>(
        '[data-not-found="reveal"]',
      );

      if (!revealEl) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_REDUCED, () => {
        gsap.set(revealEl, { opacity: 0.35 });
      });

      mm.add(MOTION_DESKTOP, () => {
        gsap.set(revealEl, { opacity: 0 });

        const onMove = (event: MouseEvent) => {
          const rect = root.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;

          gsap.to(revealEl, {
            opacity: 0.55,
            duration: dur.micro,
            ease: ease.out,
          });

          revealEl.style.clipPath = `circle(28% at ${x}% ${y}%)`;
        };

        root.addEventListener("mousemove", onMove);

        return () => root.removeEventListener("mousemove", onMove);
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-[clamp(16px,3vw,40px)] py-24 text-center">
      <div
        ref={rootRef}
        className="instant-frame relative aspect-[4/5] w-[min(320px,80vw)] overflow-hidden"
      >
        <div className="absolute inset-0 bg-paper-2" aria-hidden="true" />
        <div
          data-not-found="reveal"
          className="absolute inset-0 bg-[linear-gradient(145deg,#9aa3a8_0%,#c8d0d4_45%,#7d8a90_100%)]"
          aria-hidden="true"
        />
      </div>

      <p className="mt-10 font-mono text-label uppercase text-ink-2">404</p>
      <h1
        data-page-title
        tabIndex={-1}
        className="mt-4 font-display text-h1 text-ink"
      >
        {notFoundTitle}
      </h1>
      <p className="mt-4 max-w-prose text-lead text-ink-2">{notFoundBody}</p>
      <div className="mt-8">
        <ButtonLink href="/">{notFoundCta}</ButtonLink>
      </div>
    </main>
  );
}
