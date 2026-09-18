import { type Asset, getAssetsByGroup } from "@/shared/lib/assets";

export const GALLERY_DISPLAY_WIDTH = 800;
export const GALLERY_DISPLAY_HEIGHT = 1000;
export const GALLERY_PHOTOS_PER_COLUMN = 6;
export const GALLERY_COLUMN_COUNT_DESKTOP = 4;
export const GALLERY_COLUMN_COUNT_MOBILE = 2;
export const GALLERY_TOTAL_SLOTS =
  GALLERY_PHOTOS_PER_COLUMN * GALLERY_COLUMN_COUNT_DESKTOP;

const PENDING_CAPTION = "[[PENDIENTE: lugar/año]]";

export type GalleryParallaxRange = {
  from: number;
  to: number;
};

export type GalleryPhotoItem = {
  slotId: string;
  assetId: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  isPlaceholder: boolean;
  caption: string;
  captionPending: boolean;
};

export type GalleryColumn = {
  id: number;
  direction: "up" | "down";
  photos: GalleryPhotoItem[];
  parallax: GalleryParallaxRange;
};

export type GalleryContent = {
  desktopColumns: GalleryColumn[];
  mobileColumns: GalleryColumn[];
};

const DESKTOP_PARALLAX: GalleryParallaxRange[] = [
  // Valores de la ficha (0/-25, -25/0, 0/-35, -15/+10) desplazados -10
  // para que ningún yPercent sea positivo y el recorte de 100svh no muestre tinta.
  { from: -10, to: -35 },
  { from: -35, to: -10 },
  { from: -10, to: -45 },
  { from: -25, to: 0 },
];

const MOBILE_PARALLAX: GalleryParallaxRange[] = [
  { from: 0, to: -12 },
  { from: -12, to: 0 },
];

const DESKTOP_DIRECTIONS: Array<"up" | "down"> = ["up", "down", "up", "down"];

const MOBILE_DIRECTIONS: Array<"up" | "down"> = ["up", "down"];

function toGalleryPhoto(
  asset: Asset,
  slotId: string,
  displayIndex: number,
): GalleryPhotoItem {
  const alt = asset.alt.trim();

  return {
    slotId,
    assetId: asset.id,
    src: asset.src,
    alt: alt || `Foto ${displayIndex} de la galería`,
    width: GALLERY_DISPLAY_WIDTH,
    height: GALLERY_DISPLAY_HEIGHT,
    blurDataURL: asset.blurDataURL,
    isPlaceholder: asset.isPlaceholder,
    caption: PENDING_CAPTION,
    captionPending: true,
  };
}

function buildPhotoPool(assets: Asset[]): GalleryPhotoItem[] {
  if (assets.length === 0) {
    throw new Error(
      "No hay assets en el grupo gallery. Registra fotos en src/content/assets.json.",
    );
  }

  return Array.from({ length: GALLERY_TOTAL_SLOTS }, (_, index) =>
    toGalleryPhoto(
      assets[index % assets.length],
      `gallery-slot-${index + 1}`,
      index + 1,
    ),
  );
}

function splitIntoColumns(
  photos: GalleryPhotoItem[],
  columnCount: number,
  parallaxRanges: GalleryParallaxRange[],
  directions: Array<"up" | "down">,
): GalleryColumn[] {
  const photosPerColumn = photos.length / columnCount;

  return Array.from({ length: columnCount }, (_, columnIndex) => ({
    id: columnIndex,
    direction: directions[columnIndex] ?? "up",
    parallax: parallaxRanges[columnIndex] ?? { from: 0, to: 0 },
    photos: Array.from({ length: photosPerColumn }, (_, rowIndex) => {
      const photoIndex = rowIndex * columnCount + columnIndex;
      return photos[photoIndex];
    }),
  }));
}

function buildGalleryContent(): GalleryContent {
  const assets = getAssetsByGroup("gallery");
  const photoPool = buildPhotoPool(assets);

  return {
    desktopColumns: splitIntoColumns(
      photoPool,
      GALLERY_COLUMN_COUNT_DESKTOP,
      DESKTOP_PARALLAX,
      DESKTOP_DIRECTIONS,
    ),
    mobileColumns: splitIntoColumns(
      photoPool,
      GALLERY_COLUMN_COUNT_MOBILE,
      MOBILE_PARALLAX,
      MOBILE_DIRECTIONS,
    ),
  };
}

export const galleryContent = buildGalleryContent();
