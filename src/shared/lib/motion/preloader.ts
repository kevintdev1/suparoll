"use client";

export const PRELOADER_SESSION_KEY = "suparoll:preloader-seen";
export const PRELOADER_COMPLETE_EVENT = "suparoll:preloader-complete";

export function hasSeenPreloader(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    return sessionStorage.getItem(PRELOADER_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPreloaderSeen(): void {
  try {
    sessionStorage.setItem(PRELOADER_SESSION_KEY, "1");
  } catch {
    // sessionStorage puede fallar en modo privado
  }
}

export function dispatchPreloaderComplete(): void {
  window.dispatchEvent(new CustomEvent(PRELOADER_COMPLETE_EVENT));
}

export function waitForPreloaderComplete(): Promise<void> {
  if (hasSeenPreloader()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const handler = () => {
      window.removeEventListener(PRELOADER_COMPLETE_EVENT, handler);
      resolve();
    };

    window.addEventListener(PRELOADER_COMPLETE_EVENT, handler);
  });
}
