"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  formatDevelopCounter,
  useDevelopReveal,
} from "@/features/landing/hooks/useDevelopReveal";

export type DevelopSnapshot = {
  src: string;
  alt: string;
  blurDataURL?: string;
};

type DevelopRevealProps = {
  titleId: string;
  title: string;
  body: string;
  developSeconds: number | null;
  snapshot: DevelopSnapshot | null;
  placeholderLabel: string;
};

export function DevelopReveal({
  titleId,
  title,
  body,
  developSeconds,
  snapshot,
  placeholderLabel,
}: DevelopRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useDevelopReveal(rootRef, developSeconds);

  return (
    <div
      ref={rootRef}
      className="flex h-svh flex-col items-center justify-center gap-6 page-margin py-8 md:gap-8"
    >
      <div
        data-anim="develop-frame"
        className="instant-frame aspect-3/4 h-[45svh] max-w-full md:h-[50svh]"
      >
        <div className="relative size-full overflow-hidden bg-ink">
          {snapshot ? (
            <Image
              src={snapshot.src}
              alt={snapshot.alt}
              fill
              placeholder={snapshot.blurDataURL ? "blur" : "empty"}
              blurDataURL={snapshot.blurDataURL}
              className="object-cover"
              sizes="(max-width: 1023px) 80vw, 40vw"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-paper-2">
              <span className="text-small text-ink-2">{placeholderLabel}</span>
            </div>
          )}

          <div
            data-anim="develop-overlay"
            aria-hidden="true"
            className="absolute inset-0 bg-linear-to-b from-paper/90 via-paper/70 to-paper/90"
          />
        </div>
      </div>

      <div className="max-w-lg text-center">
        {developSeconds !== null && (
          <p
            data-anim="develop-counter"
            aria-hidden="true"
            className="font-mono-label text-paper/70"
          >
            {formatDevelopCounter(0)}
          </p>
        )}

        <h2
          id={titleId}
          data-anim="develop-text"
          className="mt-3 font-display text-h3 md:mt-4"
        >
          {title}
        </h2>

        <p
          data-anim="develop-text"
          className="mt-3 text-lead text-paper/80 md:mt-4"
        >
          {body}
        </p>
      </div>
    </div>
  );
}
