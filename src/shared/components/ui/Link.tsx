"use client";

import NextLink from "next/link";
import type { ComponentPropsWithoutRef, MouseEvent, Ref } from "react";
import {
  shouldTransitionHref,
  usePageTransition,
} from "@/shared/components/layout/PageTransition";
import { getPageLabel } from "@/shared/lib/navigation";

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  ref?: Ref<HTMLAnchorElement>;
  transition?: boolean;
};

function LinkInner({
  className = "",
  children,
  href,
  ref,
  transition = true,
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
    pageTransition.navigate(hrefString, getPageLabel(hrefString));
  };

  return (
    <NextLink
      ref={ref}
      href={href}
      className={`link-underline inline-block text-ink focus-visible:focus-ring ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </NextLink>
  );
}

export function Link(props: LinkProps) {
  return <LinkInner {...props} />;
}
