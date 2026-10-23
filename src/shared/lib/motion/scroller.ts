import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function registerLenis(instance: Lenis | null): void {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

export function scrollToTop(options?: { immediate?: boolean }): void {
  const immediate = options?.immediate ?? false;

  if (lenisInstance) {
    lenisInstance.scrollTo(0, { immediate });
    return;
  }

  window.scrollTo({ top: 0, behavior: immediate ? "instant" : "smooth" });
}
