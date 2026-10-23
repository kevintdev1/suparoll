"use client";

import { useCallback, useRef, useState } from "react";
import { GalleryLightbox } from "@/features/landing/components/GalleryLightbox";
import { GalleryPhoto } from "@/features/landing/components/GalleryPhoto";
import { useKeepFocusInClip } from "@/features/landing/hooks/useKeepFocusInClip";
import type {
  GalleryColumn,
  GalleryPhotoItem,
} from "@/features/landing/lib/gallery";
import { getDebugMotion } from "@/shared/lib/motion/debug";
import { gsap, useGSAP } from "@/shared/lib/motion/gsap";
import { MEDIA_DESKTOP, MOTION_REDUCED } from "@/shared/lib/motion/media";
import { dur, ease, scrub, stagger } from "@/shared/lib/motion/tokens";

type GalleryColumnsProps = {
  trackId: string;
  desktopColumns: GalleryColumn[];
  mobileColumns: GalleryColumn[];
  labels: { openPhoto: string; closeViewer: string };
};

type ColumnListProps = {
  column: GalleryColumn;
  openLabel: string;
  onOpen: (photo: GalleryPhotoItem) => void;
};

const COLUMN_SELECTOR = '[data-anim="column"]';

function ColumnList({ column, openLabel, onOpen }: ColumnListProps) {
  return (
    <ul
      data-anim="column"
      data-direction={column.direction}
      className="flex flex-col gap-2"
    >
      {column.photos.map((photo) => (
        <li key={photo.slotId}>
          <GalleryPhoto photo={photo} openLabel={openLabel} onOpen={onOpen} />
        </li>
      ))}
    </ul>
  );
}

function revealColumns(track: HTMLElement, columnEls: HTMLElement[]) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      start: "top 80%",
      once: true,
      markers: getDebugMotion(),
    },
  });

  for (const columnEl of columnEls) {
    const masks = columnEl.querySelectorAll('[data-anim="photo-mask"]');

    gsap.set(masks, { autoAlpha: 1, scaleY: 1 });
    tl.to(
      masks,
      {
        scaleY: 0,
        duration: dur.reveal,
        ease: ease.reveal,
        stagger: stagger.items,
      },
      0,
    );
  }
}

function parallaxColumns(
  track: HTMLElement,
  columnEls: HTMLElement[],
  columns: GalleryColumn[],
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: track,
      start: "top bottom",
      end: "bottom bottom",
      scrub: scrub.parallax,
      markers: getDebugMotion(),
    },
  });

  columns.forEach((column, index) => {
    const columnEl = columnEls[index];

    if (columnEl) {
      tl.fromTo(
        columnEl,
        { yPercent: column.parallax.from },
        { yPercent: column.parallax.to, ease: ease.scrub },
        0,
      );
    }
  });
}

function fadeColumns(track: HTMLElement, columnEls: HTMLElement[]) {
  gsap.from(
    columnEls.flatMap((columnEl) =>
      gsap.utils.toArray<HTMLElement>('[data-anim="photo"]', columnEl),
    ),
    {
      autoAlpha: 0,
      duration: dur.base,
      ease: ease.out,
      stagger: stagger.items,
      scrollTrigger: {
        trigger: track,
        start: "top 80%",
        once: true,
        markers: getDebugMotion(),
      },
    },
  );
}

export function GalleryColumns({
  trackId,
  desktopColumns,
  mobileColumns,
  labels,
}: GalleryColumnsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryPhotoItem | null>(null);

  const handleClose = useCallback(() => setActivePhoto(null), []);

  useKeepFocusInClip(rootRef, COLUMN_SELECTOR);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = document.getElementById(trackId);

      if (!root || !track) {
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        { isDesktop: MEDIA_DESKTOP, reduceMotion: MOTION_REDUCED },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions ?? {};
          const grid = isDesktop ? "desktop" : "mobile";
          const columnEls = gsap.utils.toArray<HTMLElement>(
            `[data-grid="${grid}"] ${COLUMN_SELECTOR}`,
            root,
          );

          if (reduceMotion) {
            fadeColumns(track, columnEls);
            return;
          }

          revealColumns(track, columnEls);
          parallaxColumns(
            track,
            columnEls,
            isDesktop ? desktopColumns : mobileColumns,
          );
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [trackId, desktopColumns, mobileColumns] },
  );

  return (
    <>
      <div
        ref={rootRef}
        className="h-[140svh] overflow-clip bg-ink md:h-full md:w-3/5"
      >
        <div
          data-grid="desktop"
          className="hidden h-full items-start gap-2 md:grid md:grid-cols-4"
        >
          {desktopColumns.map((column) => (
            <ColumnList
              key={column.id}
              column={column}
              openLabel={labels.openPhoto}
              onOpen={setActivePhoto}
            />
          ))}
        </div>

        <div
          data-grid="mobile"
          className="grid h-full grid-cols-2 items-start gap-2 md:hidden"
        >
          {mobileColumns.map((column) => (
            <ColumnList
              key={column.id}
              column={column}
              openLabel={labels.openPhoto}
              onOpen={setActivePhoto}
            />
          ))}
        </div>
      </div>

      <GalleryLightbox
        photo={activePhoto}
        closeLabel={labels.closeViewer}
        onClose={handleClose}
      />
    </>
  );
}
