"use client";

import type { ButtonHTMLAttributes, Ref } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  ref?: Ref<HTMLButtonElement>;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  disabled,
  ref,
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-pill px-8 text-small font-medium transition-transform duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 focus-visible:focus-ring";

  const variants: Record<ButtonVariant, string> = {
    primary: [
      "group bg-ink text-paper",
      "before:absolute before:inset-0 before:bg-shutter before:[clip-path:inset(100%_0_0_0)]",
      "before:transition-[clip-path] before:duration-300 before:ease-out",
      "hover:before:[clip-path:inset(0_0_0_0)]",
    ].join(" "),
    secondary: [
      "border border-ink bg-transparent text-ink",
      "hover:bg-ink hover:text-paper",
      "transition-colors duration-300",
    ].join(" "),
  };

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {variant === "primary" ? (
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
      ) : (
        children
      )}
    </button>
  );
}
