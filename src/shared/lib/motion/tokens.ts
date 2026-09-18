"use client";

import { CustomEase } from "@/shared/lib/motion/gsap";

if (typeof window !== "undefined") {
  CustomEase.create("reveal", "0.77, 0, 0.175, 1");
}

export const ease = {
  reveal: "reveal",
  out: "power3.out",
  inOut: "power2.inOut",
  scrub: "none",
} as const;

export const dur = {
  micro: 0.25,
  base: 0.6,
  reveal: 1.1,
  page: 0.9,
} as const;

export const stagger = {
  chars: 0.02,
  lines: 0.08,
  items: 0.06,
} as const;

export const scrub = {
  scene: 1,
  parallax: true,
} as const;
