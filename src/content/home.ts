export type FeatureCard = {
  number: string;
  title: string;
  body: string;
  imageAssetId: string | null;
};

export type SocialReview = {
  author: string;
  body: string;
  rating: number;
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
    developSeconds: number | null;
    snapshotAssetId: string | null;
    snapshotAlt: string;
    placeholderLabel: string;
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
    reviews: SocialReview[] | null;
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
    socialLabel: string;
    navTitle: string;
    legalTitle: string;
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
      topLeft: "Suparoll One",
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
        imageAssetId: "feature-01",
      },
      {
        number: "02",
        title: "Diseño icónico",
        body: "Formas limpias, colores honestos y un objeto que quieres dejar a la vista, no guardar en un cajón.",
        imageAssetId: "feature-02",
      },
      {
        number: "03",
        title: "Sin pantallas",
        body: "Nada de menús ni filtros. Solo tú, el visor y el momento. Menos pantalla, más presencia.",
        imageAssetId: "feature-03",
      },
    ],
  },

  develop: {
    id: "develop",
    title: "Se revela en segundos",
    body: "Mira cómo la instantánea pasa de gris a color mientras haces scroll — igual que en la vida real.",
    developSeconds: 15,
    snapshotAssetId: "develop-photo",
    snapshotAlt: "Foto instantánea revelándose",
    placeholderLabel: "Instantánea de ejemplo",
  },

  specs: {
    id: "specs",
    title: "Especificaciones",
    subtitle: "Todo lo que necesitas saber antes de disparar.",
    profileAssetId: "specs-camera-side",
  },

  colors: {
    id: "colors",
    title: "Elige tu color",
    body: "Un solo acabado por ahora. Blanco puro, base negra y el rojo del disparador como acento.",
  },

  social: {
    id: "social",
    title: "Lo que dicen",
    reviews: [
      {
        author: "Lucía M.",
        body: "La regalé a mi hermana y no ha parado de usarla en salidas. Las fotos quedan con un color muy cálido.",
        rating: 5,
      },
      {
        author: "Carlos R.",
        body: "Me gusta que no tenga pantalla: te obliga a pensar el encuadre. El revelado es casi instantáneo.",
        rating: 5,
      },
      {
        author: "Elena V.",
        body: "Ligera, bonita y lista para salir. La correa y el cartucho de prueba vienen muy bien para empezar.",
        rating: 5,
      },
    ],
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
      "Envío gratuito a partir de $50 · Garantía 2 años · Devolución 30 días",
  },

  footer: {
    id: "footer",
    socialLabel: "Redes sociales",
    navTitle: "Navegación",
    legalTitle: "Legal",
  },
};
