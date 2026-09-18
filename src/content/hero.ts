export type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HeroFit = {
  cameraWidth: number;
  cameraHeight: number;
};

export type HeroPhases = {
  giro: number;
  acercamiento: number;
  visor: number;
  sangre: number;
  tarjeta: number;
};

export type HeroVariant = {
  scrollLength: string;
  fit: HeroFit;
  cardWidth: number;
  cardRadius: number;
  cardAspect: number;
};

export type HeroScene = {
  cameraBox: NormalizedRect;
  viewfinderRect: NormalizedRect;
  viewfinderRadiusRatio: number;
  viewfinderTargetHeight: number;
  zoomMax: number;
  exitZoomFactor: number;
  phases: HeroPhases;
  progressLabels: { from: number; label: string }[];
  desktop: HeroVariant;
  mobile: HeroVariant;
};

export const heroScene: HeroScene = {
  // Unión de la silueta de la cámara en 9 frames del giro, sin la sombra proyectada.
  cameraBox: { x: 0.245, y: 0.26, width: 0.515, height: 0.645 },

  // Hueco oscuro del ocular trasero, medido sobre el último frame del giro.
  viewfinderRect: { x: 0.502, y: 0.316, width: 0.034, height: 0.1 },
  viewfinderRadiusRatio: 0.12,
  viewfinderTargetHeight: 0.32,

  zoomMax: 5,
  exitZoomFactor: 1.5,

  phases: {
    giro: 0,
    acercamiento: 0.3,
    visor: 0.55,
    sangre: 0.7,
    tarjeta: 0.85,
  },

  progressLabels: [
    { from: 0, label: "01 — Encuadra" },
    { from: 0.3, label: "02 — Mira" },
    { from: 0.7, label: "03 — Revela" },
  ],

  desktop: {
    scrollLength: "+=450%",
    fit: { cameraWidth: 0.52, cameraHeight: 0.68 },
    cardWidth: 0.88,
    cardRadius: 24,
    cardAspect: 16 / 9,
  },

  mobile: {
    scrollLength: "+=300%",
    fit: { cameraWidth: 0.94, cameraHeight: 0.52 },
    cardWidth: 0.92,
    cardRadius: 16,
    cardAspect: 9 / 16,
  },
};
