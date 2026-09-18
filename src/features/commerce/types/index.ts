import type { CheckoutValues } from "../schemas/checkout.schema";

export class CommerceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommerceError";
  }
}

export type ShippingStatus = "pending" | "flat" | "free" | "threshold";

export type CommerceVariant = {
  id: string;
  name: string;
  colorHex: string;
  imageAssetId: string;
  available: boolean;
};

export type CommerceProduct = {
  id: string;
  brand: string;
  model: string | null;
  price: number | null;
  compareAtPrice: number | null;
  currency: string | null;
  variants: CommerceVariant[];
};

export type CartLine = {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  variantName: string;
  quantity: number;
  unitPrice: number | null;
  currency: string | null;
  imageAssetId: string;
  colorHex: string;
};

export type Cart = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number | null;
  shippingStatus: ShippingStatus;
  shippingLabel: string;
  total: number | null;
};

export type CheckoutInput = CheckoutValues;

export type ActionResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export type SimulatedOrder = {
  orderId: string;
  lines: CartLine[];
  subtotal: number | null;
  shippingLabel: string;
  currency: string | null;
  contactName: string;
};

export type CommerceProvider = {
  getProduct: () => CommerceProduct;
  getCart: () => Cart;
  addToCart: (variantId: string, quantity?: number) => Cart;
  updateLine: (lineId: string, quantity: number) => Cart;
  removeLine: (lineId: string) => Cart;
  checkout: (input: CheckoutInput) => SimulatedOrder;
};

export type LastAdded = {
  variantId: string;
  imageAssetId: string;
};
