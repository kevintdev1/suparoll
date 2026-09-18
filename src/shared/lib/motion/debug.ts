"use client";

function getDebugFlag(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("debug");
}

export function getDebugMotion(): boolean {
  return getDebugFlag() === "motion";
}

export function getDebugHero(): boolean {
  return getDebugFlag() === "hero";
}
