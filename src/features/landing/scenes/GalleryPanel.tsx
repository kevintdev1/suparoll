"use client";

import { Link } from "@/shared/components/ui/Link";
import { RevealText } from "@/shared/components/ui/RevealText";

type GalleryPanelProps = {
  title: string;
  phrase: string;
  cta: { label: string; href: string };
};

export function GalleryPanel({ title, phrase, cta }: GalleryPanelProps) {
  return (
    <aside
      data-anim="gallery-panel"
      className="flex shrink-0 flex-col justify-between gap-12 bg-paper px-[clamp(16px,3vw,40px)] py-16 md:h-full md:w-[40%] md:py-24"
    >
      <div className="space-y-6">
        <RevealText
          as="h2"
          id="gallery-title"
          split="lines"
          trigger="scroll"
          scrollStart="top 80%"
          className="font-display text-h1 uppercase leading-[0.95] tracking-[-0.03em] text-ink"
        >
          {title}
        </RevealText>
        <RevealText
          as="p"
          split="lines"
          trigger="scroll"
          scrollStart="top 80%"
          className="max-w-[18ch] font-display text-h3 text-ink-2"
        >
          {phrase}
        </RevealText>
      </div>

      <Link
        href={cta.href}
        className="group relative inline-flex h-12 w-fit items-center justify-center overflow-hidden rounded-pill bg-ink px-8 text-small font-medium text-paper no-underline transition-transform duration-200 after:hidden hover:bg-shutter focus-visible:focus-ring active:scale-[0.97]"
      >
        {cta.label}
      </Link>
    </aside>
  );
}
