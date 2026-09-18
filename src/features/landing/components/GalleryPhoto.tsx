"use client";

import Image from "next/image";
import type { GalleryPhotoItem } from "@/content/gallery";

type GalleryPhotoProps = {
  photo: GalleryPhotoItem;
  onOpen: (photo: GalleryPhotoItem) => void;
};

export function GalleryPhoto({ photo, onOpen }: GalleryPhotoProps) {
  return (
    <figure data-anim="photo" className="group relative w-full shrink-0">
      <button
        type="button"
        onClick={() => onOpen(photo)}
        aria-label={photo.alt}
        className="block w-full text-left focus-visible:focus-ring"
      >
        <div data-reveal data-anim="reveal-image" className="w-full">
          <div
            data-anim="reveal-clip"
            className="aspect-[4/5] w-full overflow-hidden bg-paper-2"
          >
            <div data-anim="reveal-inner" className="h-full w-full">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 15vw, 50vw"
                loading="lazy"
                placeholder={photo.blurDataURL ? "blur" : undefined}
                blurDataURL={photo.blurDataURL}
                className="h-full w-full origin-center object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.06] motion-safe:group-focus-visible:scale-[1.06]"
              />
            </div>
          </div>
        </div>
        {photo.captionPending ? null : (
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent px-3 py-4 font-mono text-label uppercase text-paper opacity-0 transition-opacity duration-300 motion-safe:group-hover:opacity-100 motion-safe:group-focus-visible:opacity-100">
            {photo.caption}
          </span>
        )}
      </button>
    </figure>
  );
}
