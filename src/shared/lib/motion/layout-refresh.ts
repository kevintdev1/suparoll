import { ScrollTrigger } from "@/shared/lib/motion/gsap";

const REFRESH_DELAY = 150;

export function refreshOnLayoutChange(target: Element): () => void {
  let timer: number | undefined;
  let lastHeight = target.getBoundingClientRect().height;

  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => ScrollTrigger.refresh(), REFRESH_DELAY);
  };

  const observer = new ResizeObserver(([entry]) => {
    const height = entry.contentRect.height;

    if (Math.abs(height - lastHeight) < 1) {
      return;
    }

    lastHeight = height;
    schedule();
  });

  observer.observe(target);
  void document.fonts.ready.then(schedule);

  return () => {
    window.clearTimeout(timer);
    observer.disconnect();
  };
}
