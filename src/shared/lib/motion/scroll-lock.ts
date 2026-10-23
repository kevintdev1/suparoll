type SmoothScroller = {
  start: () => void;
  stop: () => void;
};

let scroller: SmoothScroller | null = null;
let locks = 0;

export function registerScroller(instance: SmoothScroller | null): void {
  scroller = instance;
}

function acquire(): void {
  locks += 1;

  if (locks === 1) {
    scroller?.stop();
    document.documentElement.style.overflow = "hidden";
  }
}

function release(): void {
  locks = Math.max(0, locks - 1);

  if (locks === 0) {
    scroller?.start();
    document.documentElement.style.overflow = "";
  }
}

export function lockScroll(): () => void {
  let released = false;

  acquire();

  return () => {
    if (released) {
      return;
    }

    released = true;
    release();
  };
}
