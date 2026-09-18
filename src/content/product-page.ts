export type ProductPageSection = {
  id: string;
  title: string;
  subtitle?: string;
};

export type ProductPageContent = {
  hero: {
    title: string;
    subtitle: string;
  };
  inTheBox: ProductPageSection & {
    items: string[] | null;
  };
  specs: ProductPageSection;
  samplePhotos: ProductPageSection & {
    description: string;
  };
  faq: ProductPageSection;
  related: ProductPageSection & {
    emptyMessage: string;
  };
  purchasePanel: {
    shippingLabel: string;
    warrantyLabel: string;
    quantityLabel: string;
  };
  galleryAssetIds: string[];
};

export const productPageContent: ProductPageContent = {
  hero: {
    title: "[[PENDIENTE: nombre comercial del modelo]]",
    subtitle: "Cámara instantánea · Suparoll",
  },

  inTheBox: {
    id: "in-the-box",
    title: "En la caja",
    subtitle: "Todo lo que recibes al abrirla.",
    items: null,
  },

  specs: {
    id: "specs-full",
    title: "Especificaciones completas",
    subtitle: "Detalles técnicos de la cámara.",
  },

  samplePhotos: {
    id: "sample-photos",
    title: "Tomadas con Suparoll",
    description:
      "Fotos reales de la comunidad. Sin filtros, sin retoques — solo luz y momento.",
  },

  faq: {
    id: "faq-product",
    title: "Preguntas sobre la cámara",
  },

  related: {
    id: "related",
    title: "También te puede interesar",
    emptyMessage: "[[PENDIENTE: accesorios — película, correa, estuche]]",
  },

  purchasePanel: {
    shippingLabel: "[[PENDIENTE: política de envío]]",
    warrantyLabel: "[[PENDIENTE: garantía]]",
    quantityLabel: "Cantidad",
  },
  galleryAssetIds: [
    "hero-camera-front",
    "hero-camera-back",
    "specs-camera-side",
  ],
};
