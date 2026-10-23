"use client";

import { type CSSProperties, useRef } from "react";
import { useFeaturesStack } from "@/features/landing/hooks/useFeaturesStack";
import { featureCardTop } from "@/features/landing/lib/features-stack";
import { RevealImage } from "@/shared/components/ui/RevealImage";

export type FeatureStackImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type FeatureStackCard = {
  number: string;
  title: string;
  body: string;
  image: FeatureStackImage | null;
};

type FeaturesStackProps = {
  cards: FeatureStackCard[];
};

function cardStyle(index: number): CSSProperties {
  return {
    "--card-top": `${featureCardTop(index)}px`,
    zIndex: index + 1,
  } as CSSProperties;
}

export function FeaturesStack({ cards }: FeaturesStackProps) {
  const rootRef = useRef<HTMLOListElement>(null);

  useFeaturesStack(rootRef, cards.length);

  return (
    <ol ref={rootRef} className="relative pb-24 md:pb-[50svh]">
      {cards.map((card, index) => (
        <li
          key={card.number}
          data-anim="feature-card"
          className="relative mb-6 md:sticky md:top-(--card-top) md:mb-0"
          style={cardStyle(index)}
        >
          <div
            data-anim="feature-face"
            className="relative min-h-[60svh] rounded-card border border-paper-2 bg-paper p-6 shadow-instant md:h-[min(70svh,calc(100svh-var(--card-top)-2rem))] md:min-h-0 md:rounded-card-lg md:p-10"
          >
            <div
              data-anim="feature-scrim"
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 rounded-[inherit] bg-ink opacity-0"
            />
            <div className="relative flex h-full flex-col md:flex-row md:items-center md:gap-12">
              <div className="flex-1">
                <p className="font-mono-label text-ink-2">{card.number}</p>
                <h3 className="mt-3 font-display text-h2 text-ink">
                  {card.title}
                </h3>
                <p className="mt-4 prose-width text-lead text-ink-2">
                  {card.body}
                </p>
              </div>

              {card.image ? (
                <div className="mt-8 flex-1 md:mt-0 md:flex md:h-full md:min-w-0 md:justify-end">
                  <RevealImage
                    src={card.image.src}
                    alt={card.image.alt}
                    width={card.image.width}
                    height={card.image.height}
                    className="aspect-4/5 w-full overflow-hidden rounded-card md:h-full md:w-auto md:max-w-full"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
