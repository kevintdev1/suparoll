export type FeatureCard = {
  number: string;
  title: string;
  body: string;
  imageAssetId: string | null;
};

export type HomeContent = {
  preloader: {
    id: "preloader";
    wordmark: string;
  };
  hero: {
    id: "hero";
    wordmark: string;
    scrollLabel: string;
    cornerLabels: { topLeft: string; bottomRight: string };
    cameraAssetId: string | null;
    sequenceAssetId: string | null;
  };
  viewfinder: {
    id: "viewfinder";
    overlayText: string;
    landscapeAssetId: string | null;
    landscapeMobileAssetId: string | null;
  };
  manifesto: {
    id: "manifesto";
    body: string;
    accentWord: string;
  };
  gallery: {
    id: "gallery";
    title: string;
    phrase: string;
    cta: { label: string; href: string };
    photoCount: number;
    photoAssetPrefix: string;
  };
  features: {
    id: "features";
    title: string;
    cards: FeatureCard[];
  };
  develop: {
    id: "develop";
    title: string;
    body: string;
    developTime: string | null;
    snapshotAssetId: string | null;
  };
  specs: {
    id: "specs";
    title: string;
    subtitle: string;
    profileAssetId: string | null;
  };
  colors: {
    id: "colors";
    title: string;
    body: string;
  };
  social: {
    id: "social";
    title: string;
    reviews: { author: string; body: string; rating: number }[] | null;
  };
  faq: {
    id: "faq";
    title: string;
  };
  ctaFinal: {
    id: "cta-final";
    headline: string;
    cta: { label: string; href: string };
    trustLabel: string;
  };
  footer: {
    id: "footer";
  };
};

export const homeContent: HomeContent = {
  preloader: {
    id: "preloader",
    wordmark: "SUPAROLL",
  },

  hero: {
    id: "hero",
    wordmark: "SUPAROLL",
    scrollLabel: "Desliza para revelar",
    cornerLabels: {
      topLeft: "[[PENDIENTE: nombre comercial del modelo]]",
      bottomRight: "2026",
    },
    cameraAssetId: "hero-camera-front",
    sequenceAssetId: "hero-sequence",
  },

  viewfinder: {
    id: "viewfinder",
    overlayText: "El mundo, tal como lo ves",
    landscapeAssetId: "hero-landscape",
    landscapeMobileAssetId: "hero-landscape-mobile",
  },

  manifesto: {
    id: "manifesto",
    body: "Hay momentos que merecen más que un archivo. Suparoll convierte lo que ves en una foto que puedes sostener, regalar y guardar. Sin pantallas ni filtros: solo luz, encuadre y el clic que lo hace real.",
    accentWord: "sostener",
  },

  gallery: {
    id: "gallery",
    title: "SUPAROLL",
    phrase: "Cada instante, se revela",
    cta: { label: "Conoce la cámara", href: "/camara" },
    photoCount: 20,
    photoAssetPrefix: "gallery",
  },

  features: {
    id: "features",
    title: "Por qué Suparoll",
    cards: [
      {
        number: "01",
        title: "En segundos",
        body: "Dispara y sostén la foto en la mano. El revelado es casi instantáneo — sin esperar, sin imprimir aparte.",
        imageAssetId: null,
      },
      {
        number: "02",
        title: "Diseño icónico",
        body: "Formas limpias, colores honestos y un objeto que quieres dejar a la vista, no guardar en un cajón.",
        imageAssetId: null,
      },
      {
        number: "03",
        title: "Sin pantallas",
        body: "Nada de menús ni filtros. Solo tú, el visor y el momento. Menos pantalla, más presencia.",
        imageAssetId: null,
      },
    ],
  },

  develop: {
    id: "develop",
    title: "Se revela en segundos",
    body: "Mira cómo la instantánea pasa de gris a color mientras haces scroll — igual que en la vida real.",
    developTime: "[[PENDIENTE: tiempo de revelado en segundos]]",
    snapshotAssetId: null,
  },

  specs: {
    id: "specs",
    title: "Especificaciones",
    subtitle: "Todo lo que necesitas saber antes de disparar.",
    profileAssetId: null,
  },

  colors: {
    id: "colors",
    title: "Elige tu color",
    body: "Un solo acabado por ahora. Blanco puro, base negra y el rojo del disparador como acento.",
  },

  social: {
    id: "social",
    title: "Lo que dicen",
    reviews: null,
  },

  faq: {
    id: "faq",
    title: "Preguntas frecuentes",
  },

  ctaFinal: {
    id: "cta-final",
    headline: "Tu próximo recuerdo empieza aquí",
    cta: { label: "Comprar ahora", href: "/camara" },
    trustLabel:
      "[[PENDIENTE: envío y garantía — ej. Envío gratis · Garantía 2 años]]",
  },

  footer: {
    id: "footer",
  },
};
