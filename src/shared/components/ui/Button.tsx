"use client";

import {
  type ButtonHTMLAttributes,
  type MouseEvent,
  type Ref,
  useRef,
} from "react";
import { MOTION_REDUCED } from "@/shared/lib/motion/media";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  loading?: boolean;
  magnetic?: boolean;
  ref?: Ref<HTMLButtonElement>;
};

const MAGNETIC_RADIUS = 80;
const MAGNETIC_MAX = 8;

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
  className = "",
  children,
  disabled,
  loading = false,
  magnetic = false,
  ref,
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const innerRef = useRef<HTMLButtonElement>(null);
  const magneticRef = useRef({ x: 0, y: 0 });

  const setRef = (node: HTMLButtonElement | null) => {
    innerRef.current = node;

    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const isDisabled = disabled || loading;

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

  const handleMouseMove = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(event);

    if (!magnetic || isDisabled) {
      return;
    }

    const reduced = window.matchMedia(MOTION_REDUCED).matches;
    const coarse = window.matchMedia("(hover: none)").matches;

    if (reduced || coarse) {
      return;
    }

    const node = innerRef.current;

    if (!node) {
      return;
    }

    const rect = node.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance > MAGNETIC_RADIUS) {
      magneticRef.current = { x: 0, y: 0 };
      node.style.transform = "";
      return;
    }

    const pull = 1 - distance / MAGNETIC_RADIUS;
    const x = (dx / distance || 0) * MAGNETIC_MAX * pull;
    const y = (dy / distance || 0) * MAGNETIC_MAX * pull;

    magneticRef.current = { x, y };
    node.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleMouseLeave = (event: MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(event);

    const node = innerRef.current;

    if (node) {
      node.style.transform = "";
    }

    magneticRef.current = { x: 0, y: 0 };
  };

  const label = loading ? <LoadingDots /> : children;

  return (
    <button
      ref={setRef}
      type="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant]} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {variant === "primary" && !loading ? (
        <span className="relative block h-[1.5em] overflow-hidden">
          <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-full block transition-transform duration-300 ease-out group-hover:-translate-y-full"
          >
            {label}
          </span>
        </span>
      ) : (
        label
      )}
    </button>
  );
}
