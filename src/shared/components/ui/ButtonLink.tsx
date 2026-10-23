"use client";

import type { MouseEvent } from "react";
import { buttonClassName } from "@/shared/components/ui/button-styles";
import { Link, type LinkProps } from "@/shared/components/ui/Link";
import { RollLabel } from "@/shared/components/ui/RollLabel";
import { useMagnetic } from "@/shared/hooks/useMagnetic";

type ButtonLinkVariant = "shutter" | "primary";

type ButtonLinkProps = Omit<LinkProps, "tone" | "underline" | "ref"> & {
  variant?: ButtonLinkVariant;
  magnetic?: boolean;
};

const SHUTTER =
  "group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-pill bg-shutter px-10 text-lead font-medium text-ink transition-transform duration-200 active:scale-[0.97] focus-visible:focus-ring md:h-16 md:px-12";

export function ButtonLink({
  variant = "shutter",
  magnetic = false,
  className = "",
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  children,
  ...props
}: ButtonLinkProps) {
  const magneticHandlers = useMagnetic<HTMLAnchorElement>(magnetic);
  const variantClass =
    variant === "primary"
      ? buttonClassName("primary", "ink", className)
      : `${SHUTTER} ${className}`;

  return (
    <Link
      ref={magneticHandlers.ref}
      tone={null}
      underline={false}
      className={variantClass}
      onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => {
        magneticHandlers.onMouseEnter();
        onMouseEnter?.(event);
      }}
      onMouseMove={(event: MouseEvent<HTMLAnchorElement>) => {
        magneticHandlers.onMouseMove(event);
        onMouseMove?.(event);
      }}
      onMouseLeave={(event: MouseEvent<HTMLAnchorElement>) => {
        magneticHandlers.onMouseLeave();
        onMouseLeave?.(event);
      }}
      {...props}
    >
      <RollLabel>{children}</RollLabel>
    </Link>
  );
}
