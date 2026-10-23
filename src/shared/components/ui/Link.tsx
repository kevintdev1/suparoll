"use client";

import NextLink from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, Ref } from "react";
import {
  shouldTransitionHref,
  usePageTransition,
} from "@/shared/components/layout/PageTransition";

export type LinkTone = "ink" | "muted" | "inverse" | "inverse-muted";

const TONES: Record<LinkTone, string> = {
  ink: "text-ink",
  muted: "text-ink-2 transition-colors hover:text-ink",
  inverse: "text-paper",
  "inverse-muted": "text-paper/70 transition-colors hover:text-paper",
};

export type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  ref?: Ref<HTMLAnchorElement>;
  transition?: boolean;
  tone?: LinkTone | null;
  underline?: boolean;
};

export function Link({
  className = "",
  href,
  transition = true,
  tone = "ink",
  underline = true,
  onClick,
  ...props
}: LinkProps) {
  const pageTransition = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      !transition ||
      !pageTransition
    ) {
      return;
    }

    const hrefString = typeof href === "string" ? href : (href.pathname ?? "/");

    if (!shouldTransitionHref(hrefString)) {
      return;
    }

    event.preventDefault();
    pageTransition.navigate(hrefString);
  };

  const toneClass = tone ? TONES[tone] : "";
  const underlineClass = underline ? "link-underline inline-block" : "";

  return (
    <NextLink
      href={href}
      className={`${underlineClass} ${toneClass} focus-visible:focus-ring ${className}`}
      onClick={handleClick}
      {...props}
    />
  );
}
