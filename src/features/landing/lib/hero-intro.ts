import { gsap, SplitText } from "@/shared/lib/motion/gsap";
import { lockScroll } from "@/shared/lib/motion/scroll-lock";
import { dur, ease, stagger } from "@/shared/lib/motion/tokens";

const INTRO_MAX = 1.8;

type HeroIntroOptions = {
  wordmark: HTMLElement;
  camera: HTMLElement;
  labels: HTMLElement[];
};

export type HeroIntro = {
  prepare: () => void;
  play: (withLock: boolean) => void;
  complete: () => void;
  dispose: () => void;
};

export function createHeroIntro({
  wordmark,
  camera,
  labels,
}: HeroIntroOptions): HeroIntro {
  let split: SplitText | null = null;
  let timeline: gsap.core.Timeline | null = null;
  let guard: gsap.core.Tween | null = null;
  let releaseLock: (() => void) | null = null;

  const release = () => {
    guard?.kill();
    guard = null;
    releaseLock?.();
    releaseLock = null;
  };

  const build = () => {
    split = SplitText.create(wordmark, {
      type: "chars",
      mask: "chars",
      aria: "auto",
    });

    gsap.set(split.chars, { yPercent: 110 });
    gsap.set(camera, { scale: 0.92, autoAlpha: 0 });
    gsap.set(labels, { autoAlpha: 0 });

    return gsap
      .timeline({ paused: true, onComplete: release })
      .to(split.chars, {
        yPercent: 0,
        duration: dur.reveal,
        ease: ease.reveal,
        stagger: stagger.chars,
      })
      .to(
        camera,
        { scale: 1, autoAlpha: 1, duration: dur.reveal, ease: ease.out },
        0.3,
      )
      .to(
        labels,
        {
          autoAlpha: 1,
          duration: dur.base,
          ease: ease.out,
          stagger: stagger.items,
        },
        0.6,
      );
  };

  const prepare = () => {
    timeline ??= build();

    return timeline;
  };

  return {
    prepare,
    play(withLock) {
      const intro = prepare();

      if (intro.progress() > 0 || intro.isActive()) {
        return;
      }

      if (withLock) {
        releaseLock = lockScroll();
        guard = gsap.delayedCall(INTRO_MAX, release);
      }

      intro.play();
    },
    complete() {
      timeline?.progress(1);
    },
    dispose() {
      release();
      timeline?.kill();
      split?.revert();
    },
  };
}
