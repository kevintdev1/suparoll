"use client";

import type { ButtonHTMLAttributes, MouseEvent, Ref } from "react";
import {
  type ButtonTone,
  type ButtonVariant,
  buttonClassName,
} from "@/shared/components/ui/button-styles";
import { RollLabel } from "@/shared/components/ui/RollLabel";
import { useMagnetic } from "@/shared/hooks/useMagnetic";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  loading?: boolean;
  magnetic?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

function LoadingDots() {
  return (
    <span aria-hidden="true" className="inline-flex gap-1">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1 animate-pulse rounded-full bg-current"
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
    </span>
  );
}

export function Button({
  variant = "primary",
  tone = "ink",
  className = "",
  children,
  disabled,
  loading = false,
  magnetic = false,
  ref,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const magneticHandlers = useMagnetic<HTMLButtonElement>(
    magnetic && !isDisabled,
  );

  const setRef = (node: HTMLButtonElement | null) => {
    magneticHandlers.ref.current = node;

    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <button
      ref={setRef}
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${buttonClassName(variant, tone, className)} disabled:pointer-events-none disabled:opacity-40`}
      onMouseEnter={(event: MouseEvent<HTMLButtonElement>) => {
        magneticHandlers.onMouseEnter();
        onMouseEnter?.(event);
      }}
      onMouseMove={(event: MouseEvent<HTMLButtonElement>) => {
        magneticHandlers.onMouseMove(event);
        onMouseMove?.(event);
      }}
      onMouseLeave={(event: MouseEvent<HTMLButtonElement>) => {
        magneticHandlers.onMouseLeave();
        onMouseLeave?.(event);
      }}
      {...props}
    >
      {loading ? (
        <>
          <LoadingDots />
          <span className="sr-only">{children}</span>
        </>
      ) : variant === "primary" ? (
        <RollLabel>{children}</RollLabel>
      ) : (
        children
      )}
    </button>
  );
}
