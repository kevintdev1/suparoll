"use client";

import { useRef } from "react";
import type { SocialReview } from "@/content/home";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MOTION_OK } from "@/shared/lib/motion/media";
import { dur, ease, stagger } from "@/shared/lib/motion/tokens";

type SocialReviewsProps = {
  reviews: SocialReview[];
};

function StarRating({ rating }: { rating: number }) {
  return (
    <p
      role="img"
      aria-label={`${rating} de 5 estrellas`}
      className="tracking-widest text-shutter"
    >
      {"★".repeat(rating)}
    </p>
  );
}

export function SocialReviews({ reviews }: SocialReviewsProps) {
  const rootRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap.from(gsap.utils.toArray('[data-anim="review-card"]', root), {
          y: 24,
          autoAlpha: 0,
          duration: dur.reveal,
          ease: ease.reveal,
          stagger: stagger.items,
          scrollTrigger: {
            trigger: root,
            start: "top 75%",
            once: true,
            markers: getDebugMotion(),
          },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [reviews] },
  );

  return (
    <ul
      ref={rootRef}
      className="mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8"
    >
      {reviews.map((review) => (
        <li
          key={`${review.author}-${review.body}`}
          data-anim="review-card"
          className="border-t border-paper-2 pt-6"
        >
          <figure className="flex h-full flex-col">
            <StarRating rating={review.rating} />
            <blockquote className="mt-4 flex-1 text-body text-ink">
              <p>“{review.body}”</p>
            </blockquote>
            <figcaption className="mt-6 font-mono-label text-ink-2">
              {review.author}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
