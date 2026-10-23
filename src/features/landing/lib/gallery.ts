import type {
  GalleryColumnLayout,
  GalleryContent,
  GalleryParallaxRange,
} from "@/content/gallery";
import type { Asset } from "@/shared/lib/assets";

export type GalleryPhotoItem = {
  slotId: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  caption: string | null;
  isDuplicate: boolean;
};

export type GalleryColumn = {
  id: number;
  direction: GalleryColumnLayout["direction"];
  parallax: GalleryParallaxRange;
  photos: GalleryPhotoItem[];
};

export type GalleryGrid = {
  desktopColumns: GalleryColumn[];
  mobileColumns: GalleryColumn[];
};

function buildPhotoPool(
  assets: Asset[],
  content: GalleryContent,
): GalleryPhotoItem[] {
  if (assets.length === 0) {
    throw new Error(
      "No hay assets en el grupo gallery. Registra fotos en src/content/assets.json.",
    );
  }

  const total = content.photosPerColumn * content.desktopColumns.length;

  return Array.from({ length: total }, (_, index) => {
    const asset = assets[index % assets.length];
    const position = index + 1;

    return {
      slotId: `gallery-slot-${position}`,
      src: asset.src,
      alt:
        asset.alt.trim() ||
        content.altFallback.replace("{index}", String(position)),
      width: content.photoSize.width,
      height: content.photoSize.height,
      blurDataURL: asset.blurDataURL,
      caption:
        content.captions.length > 0
          ? content.captions[index % content.captions.length]
          : null,
      isDuplicate: index >= assets.length,
    };
  });
}

function splitIntoColumns(
  photos: GalleryPhotoItem[],
  layouts: GalleryColumnLayout[],
): GalleryColumn[] {
  const columnCount = layouts.length;
  const photosPerColumn = Math.ceil(photos.length / columnCount);

  return layouts.map((layout, columnIndex) => ({
    id: columnIndex,
    direction: layout.direction,
    parallax: layout.parallax,
    photos: Array.from(
      { length: photosPerColumn },
      (_, rowIndex) => photos[rowIndex * columnCount + columnIndex],
    ).filter(Boolean),
  }));
}

export function buildGalleryGrid(
  assets: Asset[],
  content: GalleryContent,
): GalleryGrid {
  const pool = buildPhotoPool(assets, content);

  return {
    desktopColumns: splitIntoColumns(pool, content.desktopColumns),
    mobileColumns: splitIntoColumns(pool, content.mobileColumns),
  };
}
