"use client";

import { useCallback, useRef, useState } from "react";
import type { GalleryColumn, GalleryPhotoItem } from "@/content/gallery";
import { GalleryLightbox } from "@/features/landing/components/GalleryLightbox";
import { GalleryPhoto } from "@/features/landing/components/GalleryPhoto";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import {
  MOTION_DESKTOP,
  MOTION_MOBILE,
  MOTION_REDUCED,
} from "@/shared/lib/motion/media";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

type GalleryColumnsProps = {
  desktopColumns: GalleryColumn[];
  mobileColumns: GalleryColumn[];
};

function ColumnList({
  column,
  onOpen,
}: {
  column: GalleryColumn;
  onOpen: (photo: GalleryPhotoItem) => void;
}) {
  return (
    <ul
      data-anim="column"
      data-direction={column.direction}
      className="flex w-full flex-col gap-2"
    >
      {column.photos.map((photo) => (
        <li key={photo.slotId}>
          <GalleryPhoto photo={photo} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}

export function GalleryColumns({
  desktopColumns,
  mobileColumns,
}: GalleryColumnsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  const handleOpen = useCallback((photo: GalleryPhotoItem) => {
    setActivePhoto(photo);
  }, []);

  const handleClose = useCallback(() => {
    setActivePhoto(null);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      const section = root?.closest("section");

      if (!root || !section) {
        return;
      }

      const setupColumnReveal = (columnEls: NodeListOf<Element>) => {
        const timelines: gsap.core.Timeline[] = [];

        columnEls.forEach((columnEl) => {
          const clipEls = columnEl.querySelectorAll(
            '[data-anim="reveal-clip"]',
          );
          const innerEls = columnEl.querySelectorAll(
            '[data-anim="reveal-inner"]',
          );
          const imageEls = columnEl.querySelectorAll(
            '[data-anim="reveal-image"]',
          );

          if (clipEls.length === 0) {
            return;
          }

          gsap.set(clipEls, { clipPath: "inset(100% 0 0 0)" });
          gsap.set(innerEls, { scale: 1.12, transformOrigin: "center center" });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
              markers: getDebugMotion(),
            },
            onStart: () => {
              imageEls.forEach((el) => {
                el.setAttribute("data-revealed", "");
              });
            },
          });

          timeline.to(clipEls, {
            clipPath: "inset(0 0 0 0)",
            duration: dur.reveal,
            ease: ease.reveal,
            stagger: stagger.items,
          });

          timeline.to(
            innerEls,
            {
              scale: 1,
              duration: dur.reveal,
              ease: ease.reveal,
              stagger: stagger.items,
            },
            "<",
          );

          timelines.push(timeline);
        });

        return () => {
          timelines.forEach((timeline) => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          });
        };
      };

      const setupParallax = (
        columnEls: NodeListOf<Element>,
        columns: GalleryColumn[],
      ) => {
        if (columnEls.length === 0) {
          return () => {};
        }

        columns.forEach((column, index) => {
          const columnEl = columnEls[index];

          if (columnEl) {
            gsap.set(columnEl, { yPercent: column.parallax.from });
          }
        });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: scrub.parallax,
            markers: getDebugMotion(),
            onToggle: (self) => {
              columnEls.forEach((columnEl) => {
                (columnEl as HTMLElement).style.willChange = self.isActive
                  ? "transform"
                  : "auto";
              });
            },
          },
        });

        columns.forEach((column, index) => {
          const columnEl = columnEls[index];

          if (columnEl) {
            timeline.to(
              columnEl,
              {
                yPercent: column.parallax.to,
                ease: ease.scrub,
                duration: 1,
              },
              0,
            );
          }
        });

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      };

      const setupReducedMotion = (columnEls: NodeListOf<Element>) => {
        const timelines: gsap.core.Timeline[] = [];

        columnEls.forEach((columnEl) => {
          const imageEls = columnEl.querySelectorAll(
            '[data-anim="reveal-image"]',
          );
          const clipEls = columnEl.querySelectorAll(
            '[data-anim="reveal-clip"]',
          );
          const innerEls = columnEl.querySelectorAll(
            '[data-anim="reveal-inner"]',
          );

          gsap.set(imageEls, { opacity: 0 });
          gsap.set(clipEls, { clipPath: "inset(0 0 0 0)" });
          gsap.set(innerEls, { scale: 1 });

          const timeline = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              once: true,
              markers: getDebugMotion(),
            },
            onStart: () => {
              imageEls.forEach((el) => {
                el.setAttribute("data-revealed", "");
              });
            },
          });

          timeline.to(imageEls, {
            opacity: 1,
            duration: dur.base,
            ease: ease.out,
            stagger: stagger.items,
          });

          timelines.push(timeline);
        });

        return () => {
          timelines.forEach((timeline) => {
            timeline.scrollTrigger?.kill();
            timeline.kill();
          });
        };
      };

      const mm = gsap.matchMedia();

      mm.add(MOTION_DESKTOP, () => {
        const desktopEls = root.querySelectorAll(
          '[data-anim="grid-desktop"] [data-anim="column"]',
        );

        const cleanupReveal = setupColumnReveal(desktopEls);
        const cleanupParallax = setupParallax(desktopEls, desktopColumns);

        return () => {
          cleanupReveal();
          cleanupParallax();
        };
      });

      mm.add(MOTION_MOBILE, () => {
        const mobileEls = root.querySelectorAll(
          '[data-anim="grid-mobile"] [data-anim="column"]',
        );

        const cleanupReveal = setupColumnReveal(mobileEls);
        const cleanupParallax = setupParallax(mobileEls, mobileColumns);

        return () => {
          cleanupReveal();
          cleanupParallax();
        };
      });

      mm.add(MOTION_REDUCED, () => {
        const visibleSelector = window.matchMedia("(min-width: 1024px)").matches
          ? '[data-anim="grid-desktop"] [data-anim="column"]'
          : '[data-anim="grid-mobile"] [data-anim="column"]';
        const cleanupReduced = setupReducedMotion(
          root.querySelectorAll(visibleSelector),
        );

        return () => {
          cleanupReduced();
        };
      });

      return () => {
        mm.revert();
      };
    },
    { scope: rootRef, dependencies: [desktopColumns, mobileColumns] },
  );

  return (
    <>
      <div
        ref={rootRef}
        data-anim="gallery-grid"
        className="h-[140svh] overflow-hidden bg-ink md:h-full md:w-[60%]"
      >
        <div
          data-anim="grid-desktop"
          className="hidden h-full items-start gap-2 md:grid md:grid-cols-4"
        >
          {desktopColumns.map((column) => (
            <ColumnList
              key={`desktop-${column.id}`}
              column={column}
              onOpen={handleOpen}
            />
          ))}
        </div>

        <div
          data-anim="grid-mobile"
          className="grid h-full grid-cols-2 items-start gap-2 md:hidden"
        >
          {mobileColumns.map((column) => (
            <ColumnList
              key={`mobile-${column.id}`}
              column={column}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      <GalleryLightbox photo={activePhoto} onClose={handleClose} />
    </>
  );
}
