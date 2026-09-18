import { galleryContent } from "@/content/gallery";
import { homeContent } from "@/content/home";
import { GalleryColumns } from "@/features/landing/scenes/GalleryColumns";
import { GalleryCover } from "@/features/landing/scenes/GalleryCover";
import { GalleryPanel } from "@/features/landing/scenes/GalleryPanel";

export function Gallery() {
  const { title, phrase, cta } = homeContent.gallery;

  return (
    <section
      id={homeContent.gallery.id}
      aria-labelledby="gallery-title"
      className="relative z-[1] bg-paper md:min-h-[220svh]"
    >
      <div
        data-anim="gallery-inner"
        className="flex flex-col md:sticky md:top-0 md:h-svh md:min-h-0 md:flex-row"
      >
        <GalleryPanel title={title} phrase={phrase} cta={cta} />
        <GalleryColumns
          desktopColumns={galleryContent.desktopColumns}
          mobileColumns={galleryContent.mobileColumns}
        />
      </div>
      <div
        data-anim="gallery-scrim"
        className="pointer-events-none absolute inset-0 bg-scrim opacity-0"
        aria-hidden="true"
      />
      <GalleryCover />
    </section>
  );
}
