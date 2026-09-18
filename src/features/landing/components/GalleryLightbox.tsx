"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { GalleryPhotoItem } from "@/content/gallery";

type GalleryLightboxProps = {
  photo: GalleryPhotoItem | null;
  onClose: () => void;
};

export function GalleryLightbox({ photo, onClose }: GalleryLightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (photo) {
      if (!dialog.open) {
        dialog.showModal();
      }
      closeButtonRef.current?.focus();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [photo]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = () => {
      onClose();
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="gallery-lightbox-title"
      className="fixed inset-0 z-50 m-0 h-full max-h-none w-full max-w-none border-0 bg-ink p-0 backdrop:bg-ink/90 open:flex open:items-center open:justify-center"
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          dialogRef.current?.close();
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          dialogRef.current?.close();
        }
      }}
    >
      {photo ? (
        <figure className="relative mx-auto flex max-h-[90svh] max-w-[min(90vw,720px)] flex-col gap-4 p-[clamp(16px,3vw,40px)]">
          <p id="gallery-lightbox-title" className="sr-only">
            {photo.alt}
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute right-[clamp(16px,3vw,40px)] top-[clamp(16px,3vw,40px)] z-10 inline-flex h-10 w-10 items-center justify-center rounded-pill bg-paper font-mono text-label uppercase text-ink focus-visible:focus-ring"
            aria-label="Cerrar visor"
          >
            ×
          </button>
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="h-full w-full object-cover"
              sizes="90vw"
              priority
            />
          </div>
          {photo.captionPending ? null : (
            <figcaption className="font-mono text-label uppercase text-paper">
              {photo.caption}
            </figcaption>
          )}
        </figure>
      ) : null}
    </dialog>
  );
}
