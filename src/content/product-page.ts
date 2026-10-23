import { type ProductSpecs, product } from "@/content/product";

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
    count: number;
    altFallback: string;
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
    title: "Suparoll One",
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
    count: 8,
    altFallback: "Foto {n} de la galería",
  },

  faq: {
    id: "faq-product",
    title: "Preguntas sobre la cámara",
  },

  related: {
    id: "related",
    title: "También te puede interesar",
    emptyMessage: "Película, correa y estuche disponibles por separado.",
  },

  purchasePanel: {
    shippingLabel: "Envío gratuito a partir de $50 · 3–5 días laborables",
    warrantyLabel: "Garantía oficial 2 años",
    quantityLabel: "Cantidad",
  },
  galleryAssetIds: [
    "hero-camera-front",
    "hero-camera-back",
    "specs-camera-side",
  ],
};

export type ProductSpecKey = Exclude<keyof ProductSpecs, "inTheBox">;

export const productSpecLabels: Record<ProductSpecKey, string> = {
  filmType: "Película",
  lens: "Lente",
  flash: "Flash",
  battery: "Batería",
  dimensions: "Dimensiones",
  weight: "Peso",
};

export type ProductSpecEntry = {
  key: ProductSpecKey;
  label: string;
  value: string | null;
};

export const productSpecEntries: ProductSpecEntry[] = (
  Object.keys(productSpecLabels) as ProductSpecKey[]
).map((key) => ({
  key,
  label: productSpecLabels[key],
  value: product.specs[key],
}));
