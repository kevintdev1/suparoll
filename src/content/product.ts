export type ProductVariant = {
  id: string;
  name: string;
  colorHex: string;
  imageAssetId: string;
};

export type ProductSpecs = {
  filmType: string | null;
  lens: string | null;
  flash: string | null;
  battery: string | null;
  dimensions: string | null;
  weight: string | null;
  inTheBox: string[] | null;
};

export type ProductAccessory = {
  id: string;
  name: string;
  price: number | null;
};

export type Product = {
  brand: string;
  model: string | null;
  price: number | null;
  compareAtPrice: number | null;
  currency: string | null;
  variants: ProductVariant[];
  specs: ProductSpecs;
  accessories: ProductAccessory[];
};

export const product: Product = {
  brand: "Suparoll",
  model: "Suparoll One",
  price: 99,
  compareAtPrice: null,
  currency: "USD",
  variants: [
    {
      id: "white",
      name: "Blanco",
      colorHex: "#FFFFFF",
      imageAssetId: "hero-camera-front",
    },
  ],
  specs: {
    filmType: "Película Suparoll Mini · 10 fotos por cartucho",
    lens: "60 mm · f/12,7 · enfoque fijo",
    flash: "Flash integrado · 0,6–2,7 m",
    battery: "Batería recargable USB-C · hasta 100 fotos por carga",
    dimensions: "120 × 95 × 55 mm",
    weight: "285 g",
    inTheBox: [
      "Cámara Suparoll One",
      "Correa de muñeca",
      "Cable USB-C",
      "Cartucho de prueba (10 fotos)",
      "Manual rápido en español",
    ],
  },
  accessories: [
    {
      id: "film-mini",
      name: "Película Suparoll Mini (10 fotos)",
      price: 14,
    },
    {
      id: "strap",
      name: "Correa de muñeca",
      price: 10,
    },
    {
      id: "case",
      name: "Estuche rígido",
      price: 22,
    },
  ],
};
