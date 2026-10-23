export type GalleryParallaxRange = {
  from: number;
  to: number;
};

export type GalleryColumnLayout = {
  direction: "up" | "down";
  parallax: GalleryParallaxRange;
};

export type GalleryContent = {
  photoSize: { width: number; height: number };
  photosPerColumn: number;
  altFallback: string;
  captions: readonly string[];
  desktopColumns: GalleryColumnLayout[];
  mobileColumns: GalleryColumnLayout[];
  labels: {
    openPhoto: string;
    closeViewer: string;
  };
};

export const galleryContent: GalleryContent = {
  photoSize: { width: 800, height: 1000 },
  photosPerColumn: 6,
  altFallback: "Foto {index} de la galería",
  captions: [
    "Barcelona '24",
    "Lisboa '25",
    "Valencia '24",
    "Madrid '25",
    "Mallorca '24",
    "San Sebastián '25",
    "Granada '24",
    "Porto '25",
    "Sevilla '24",
    "Bilbao '25",
    "Málaga '24",
    "Copenhague '25",
    "Ibiza '24",
    "Lyon '25",
    "Toledo '24",
    "Ámsterdam '25",
    "Cádiz '24",
    "Roma '25",
    "Girona '24",
    "Berlín '25",
  ],
  desktopColumns: [
    { direction: "up", parallax: { from: -10, to: -35 } },
    { direction: "down", parallax: { from: -35, to: -10 } },
    { direction: "up", parallax: { from: -10, to: -45 } },
    { direction: "down", parallax: { from: -25, to: 0 } },
  ],
  mobileColumns: [
    { direction: "up", parallax: { from: 0, to: -12 } },
    { direction: "down", parallax: { from: -12, to: 0 } },
  ],
  labels: {
    openPhoto: "Ampliar foto",
    closeViewer: "Cerrar visor",
  },
};
