import { galleryContent } from "@/content/gallery";
import { homeContent } from "@/content/home";
import { buildGalleryGrid } from "@/features/landing/lib/gallery";
import { GalleryColumns } from "@/features/landing/scenes/GalleryColumns";
import { GalleryPanel } from "@/features/landing/scenes/GalleryPanel";
import {
  type CoverStep,
  SectionCover,
} from "@/features/landing/scenes/SectionCover";
import { getAssetsByGroup } from "@/shared/lib/assets";

const TITLE_ID = "gallery-title";

const COVER_DESKTOP: CoverStep = {
  scale: 0.94,
  scrim: 0.45,
  end: "+=100%",
  pin: true,
};

const COVER_MOBILE: CoverStep = { scale: 0.96, scrim: 0.45, end: "+=50%" };

export function Gallery() {
  const { id, title, phrase, cta } = homeContent.gallery;
  const { desktopColumns, mobileColumns } = buildGalleryGrid(
    getAssetsByGroup("gallery"),
    galleryContent,
  );

  return (
    <SectionCover
      id={id}
      aria-labelledby={TITLE_ID}
      desktop={COVER_DESKTOP}
      mobile={COVER_MOBILE}
      className="z-1 bg-paper md:min-h-[220svh]"
    >
      <div
        data-anim="cover-inner"
        className="flex flex-col md:sticky md:top-0 md:h-svh md:flex-row"
      >
        <GalleryPanel
          titleId={TITLE_ID}
          title={title}
          phrase={phrase}
          cta={cta}
        />
        <GalleryColumns
          trackId={id}
          desktopColumns={desktopColumns}
          mobileColumns={mobileColumns}
          labels={galleryContent.labels}
        />
      </div>
    </SectionCover>
  );
}
