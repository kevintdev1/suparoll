"use client";

import type { ComponentPropsWithoutRef, RefObject } from "react";
import { Link } from "@/shared/components/ui/Link";
import { useMagnetic } from "@/shared/hooks/useMagnetic";

type ButtonLinkProps = ComponentPropsWithoutRef<typeof Link> & {
  magnetic?: boolean;
};

export function ButtonLink({
  magnetic = false,
  className = "",
  onMouseMove,
  onMouseLeave,
  children,
  ...props
}: ButtonLinkProps) {
  const magneticHandlers = useMagnetic(magnetic);

  return (
    <Link
      ref={magneticHandlers.ref as RefObject<HTMLAnchorElement>}
      className={`group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-pill bg-shutter px-10 text-body font-medium text-paper transition-transform duration-200 active:scale-[0.97] focus-visible:focus-ring md:h-16 md:px-12 md:text-lead ${className}`}
      onMouseMove={(event) => {
        magneticHandlers.onMouseMove(event);
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        magneticHandlers.onMouseLeave();
        onMouseLeave?.(event);
      }}
      {...props}
    >
      <span className="relative block h-[1.5em] overflow-hidden">
        <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-full block transition-transform duration-300 ease-out group-hover:-translate-y-full"
        >
          {children}
        </span>
      </span>
    </Link>
  );
}
