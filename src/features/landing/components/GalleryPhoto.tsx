import Image from "next/image";
import type { GalleryPhotoItem } from "@/features/landing/lib/gallery";

type GalleryPhotoProps = {
  photo: GalleryPhotoItem;
  openLabel: string;
  onOpen: (photo: GalleryPhotoItem) => void;
};

export function GalleryPhoto({ photo, openLabel, onOpen }: GalleryPhotoProps) {
  return (
    <figure
      data-anim="photo"
      aria-hidden={photo.isDuplicate || undefined}
      className="group relative"
    >
      <button
        type="button"
        data-cursor="view"
        tabIndex={photo.isDuplicate ? -1 : undefined}
        onClick={() => onOpen(photo)}
        aria-label={`${openLabel}: ${photo.alt}`}
        className="relative block aspect-4/5 w-full overflow-hidden bg-paper-2 focus-visible:focus-ring"
      >
        <Image
          src={photo.src}
          alt=""
          width={photo.width}
          height={photo.height}
          sizes="(min-width: 1024px) 15vw, 50vw"
          placeholder={photo.blurDataURL ? "blur" : undefined}
          blurDataURL={photo.blurDataURL}
          className="size-full object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-106 motion-safe:group-focus-within:scale-106"
        />
        <span
          data-anim="photo-mask"
          aria-hidden="true"
          className="invisible absolute inset-0 origin-top bg-ink"
        />
      </button>
      {photo.caption ? (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/70 to-transparent px-3 py-4 font-mono-label text-paper opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
          {photo.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
