"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import type { GalleryPhotoItem } from "@/features/landing/lib/gallery";
import { lockScroll } from "@/shared/lib/motion/scroll-lock";

type GalleryLightboxProps = {
  photo: GalleryPhotoItem | null;
  closeLabel: string;
  onClose: () => void;
};

export function GalleryLightbox({
  photo,
  closeLabel,
  onClose,
}: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog || !photo) {
      return;
    }

    if (!dialog.open) {
      dialog.showModal();
    }

    const release = lockScroll();

    const onBackdropClick = (event: MouseEvent) => {
      if (!figureRef.current?.contains(event.target as Node)) {
        dialog.close();
      }
    };

    dialog.addEventListener("click", onBackdropClick);

    return () => {
      dialog.removeEventListener("click", onBackdropClick);
      release();

      if (dialog.open) {
        dialog.close();
      }
    };
  }, [photo]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="dialog-full"
      onClose={onClose}
    >
      {photo ? (
        <div className="flex size-full items-center justify-center bg-ink/90 page-margin">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label={closeLabel}
            className="absolute top-(--margin-page) right-(--margin-page) z-10 inline-flex size-10 items-center justify-center rounded-pill bg-paper font-mono-label text-ink after:absolute after:-inset-1 focus-visible:focus-ring"
          >
            ×
          </button>
          <figure ref={figureRef} className="flex flex-col gap-4">
            <p id={titleId} className="sr-only">
              {photo.alt}
            </p>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 1024px) 45rem, 90vw"
              className="aspect-4/5 h-[min(80svh,112.5vw,56rem)] w-auto bg-ink object-cover"
              priority
            />
            {photo.caption ? (
              <figcaption className="font-mono-label text-paper">
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </dialog>
  );
}
