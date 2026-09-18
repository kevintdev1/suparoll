export type ProductVariant = {
  id: string;
  name: string;
  colorHex: string;
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
  model: null,
  price: null,
  compareAtPrice: null,
  currency: null,
  variants: [
    {
      id: "white",
      name: "Blanco",
      colorHex: "#FFFFFF",
    },
  ],
  specs: {
    filmType: null,
    lens: null,
    flash: null,
    battery: null,
    dimensions: null,
    weight: null,
    inTheBox: null,
  },
  accessories: [],
};
