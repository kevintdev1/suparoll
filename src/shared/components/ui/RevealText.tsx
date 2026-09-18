"use client";

import { createElement, type ElementType, type ReactNode, useRef } from "react";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, SplitText, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import {
  dur,
  ease,
  stagger as staggerTokens,
} from "@/shared/lib/motion/tokens";

type TextTag = "p" | "h1" | "h2" | "h3" | "span";
type SplitMode = "lines" | "words" | "chars";
type TriggerMode = "scroll" | "mount";

type RevealTextProps = {
  as?: TextTag;
  id?: string;
  split?: SplitMode;
  trigger?: TriggerMode;
  delay?: number;
  accentWord?: string;
  className?: string;
  scrollStart?: string;
  children: ReactNode;
};

const STAGGER_BY_SPLIT: Record<SplitMode, number> = {
  lines: staggerTokens.lines,
  words: staggerTokens.items,
  chars: staggerTokens.chars,
};

function wrapAccentWord(text: string, accentWord?: string): ReactNode {
  if (!accentWord || !text.includes(accentWord)) {
    return text;
  }

  const index = text.indexOf(accentWord);
  const before = text.slice(0, index);
  const after = text.slice(index + accentWord.length);

  return (
    <>
      {before}
      <span data-anim="accent">{accentWord}</span>
      {after}
    </>
  );
}

function getTextContent(children: ReactNode): string {
  if (typeof children === "string") {
    return children;
  }

  if (typeof children === "number") {
    return String(children);
  }

  return "";
}

function getSplitTargets(splitInstance: SplitText, mode: SplitMode): Element[] {
  if (mode === "lines") {
    return splitInstance.lines;
  }

  if (mode === "words") {
    return splitInstance.words;
  }

  return splitInstance.chars;
}

export function RevealText({
  as = "p",
  id,
  split = "lines",
  trigger = "scroll",
  delay = 0,
  accentWord,
  className,
  scrollStart = "top 75%",
  children,
}: RevealTextProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);

  const textContent = getTextContent(children);
  const content = accentWord
    ? wrapAccentWord(textContent, accentWord)
    : children;

  useGSAP(
    () => {
      const textEl = textRef.current;
      const scopeEl = scopeRef.current;

      if (!textEl || !scopeEl) {
        return;
      }

      let hasPlayed = false;
      let splitInstance: SplitText | null = null;
      let activeTween: gsap.core.Timeline | undefined;

      const revealContent = () => {
        textEl.style.visibility = "visible";
        textEl.setAttribute("data-revealed", "");
      };

      const animateSplit = (instance: SplitText) => {
        const targets = getSplitTargets(instance, split);

        if (targets.length === 0) {
          return undefined;
        }

        if (hasPlayed) {
          gsap.set(targets, { y: "0%" });
          const accentEl = textEl.querySelector<HTMLElement>(
            '[data-anim="accent"]',
          );
          if (accentEl) {
            gsap.set(accentEl, { color: "var(--color-shutter)" });
          }
          return undefined;
        }

        gsap.set(targets, { y: "110%" });

        const accentEl = textEl.querySelector<HTMLElement>(
          '[data-anim="accent"]',
        );

        const tweenVars = {
          y: "0%",
          duration: dur.reveal,
          ease: ease.reveal,
          stagger: STAGGER_BY_SPLIT[split],
        };

        if (trigger === "mount") {
          const timeline = gsap.timeline({
            delay,
            onComplete: () => {
              hasPlayed = true;
            },
          });

          timeline.to(targets, tweenVars);

          if (accentEl) {
            timeline.to(
              accentEl,
              { color: "var(--color-shutter)", duration: dur.micro },
              "-=0.3",
            );
          }

          return timeline;
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: scopeEl,
            start: scrollStart,
            once: true,
            markers: getDebugMotion(),
          },
          delay,
          onComplete: () => {
            hasPlayed = true;
          },
        });

        timeline.to(targets, tweenVars);

        if (accentEl) {
          timeline.to(
            accentEl,
            { color: "var(--color-shutter)", duration: dur.micro },
            "-=0.3",
          );
        }

        return timeline;
      };

      const setupSplit = () => {
        revealContent();

        splitInstance?.revert();

        splitInstance = SplitText.create(textEl, {
          type: split,
          mask: split,
          autoSplit: true,
          aria: "auto",
          onSplit: (instance) => {
            activeTween?.kill();
            activeTween = animateSplit(instance);
          },
        });
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        setupSplit();

        return () => {
          activeTween?.kill();
          splitInstance?.revert();
          splitInstance = null;
        };
      });

      mm.add(MOTION_MOBILE, () => {
        setupSplit();

        return () => {
          activeTween?.kill();
          splitInstance?.revert();
          splitInstance = null;
        };
      });

      mm.add(MOTION_REDUCED, () => {
        revealContent();
        splitInstance?.revert();
        splitInstance = null;

        const accentEl = textEl.querySelector<HTMLElement>(
          '[data-anim="accent"]',
        );
        if (accentEl) {
          accentEl.style.color = "var(--color-shutter)";
        }
      });

      return () => {
        mm.revert();
      };
    },
    {
      scope: scopeRef,
      dependencies: [
        split,
        trigger,
        delay,
        accentWord,
        scrollStart,
        textContent,
      ],
    },
  );

  return (
    <div ref={scopeRef}>
      {createElement(
        as as ElementType,
        {
          ref: textRef,
          id,
          className,
          "data-reveal": true,
          "data-anim": "reveal-text",
        },
        content,
      )}
    </div>
  );
}
