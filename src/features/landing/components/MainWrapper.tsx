"use client";

import { type ReactNode, useRef } from "react";
import { useFooterReveal } from "@/features/landing/hooks/useFooterReveal";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

type MainWrapperProps = {
  children: ReactNode;
  footer: ReactNode;
};

export function MainWrapper({ children, footer }: MainWrapperProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const revealHeight = useFooterReveal(footerRef);
  const fixed = revealHeight > 0;

  return (
    <>
      <main
        id={MAIN_CONTENT_ID}
        className="relative z-1 bg-paper"
        style={fixed ? { marginBottom: revealHeight } : undefined}
      >
        {children}
      </main>
      <div
        ref={footerRef}
        className={fixed ? "fixed inset-x-0 bottom-0 z-0" : undefined}
      >
        {footer}
      </div>
    </>
  );
}
