"use client";

import { RevealText } from "@/shared/components/ui/RevealText";

type ManifestoRevealProps = {
  body: string;
  accentWord: string;
};

export function ManifestoReveal({ body, accentWord }: ManifestoRevealProps) {
  return (
    <RevealText
      as="p"
      split="lines"
      trigger="scroll"
      accentWord={accentWord}
      className="font-display text-h2 text-ink"
    >
      {body}
    </RevealText>
  );
}
