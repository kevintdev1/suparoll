"use client";

import NextLink from "next/link";
import type { ComponentPropsWithoutRef, Ref } from "react";

type LinkProps = ComponentPropsWithoutRef<typeof NextLink> & {
  ref?: Ref<HTMLAnchorElement>;
};

export function Link({ className = "", children, ref, ...props }: LinkProps) {
  return (
    <NextLink
      ref={ref}
      className={`link-underline inline-block text-ink focus-visible:focus-ring ${className}`}
      {...props}
    >
      {children}
    </NextLink>
  );
}
