"use client";

type SmoothScroller = {
  start: () => void;
  stop: () => void;
};

let scroller: SmoothScroller | null = null;
let locks = 0;

export function registerScroller(instance: SmoothScroller | null): void {
  scroller = instance;
}

export function lockScroll(): void {
  locks += 1;

  if (locks === 1) {
    scroller?.stop();
  }
}

export function unlockScroll(): void {
  if (locks === 0) {
    return;
  }

  locks -= 1;

  if (locks === 0) {
    scroller?.start();
  }
}
