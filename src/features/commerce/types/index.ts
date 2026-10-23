import type { z } from "zod";
import type {
  cartLineSchema,
  cartSchema,
  orderSchema,
} from "../schemas/cart.schema";
import type { CheckoutValues } from "../schemas/checkout.schema";

export class CommerceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommerceError";
  }
}

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

export type CartLine = z.infer<typeof cartLineSchema>;

export type Cart = z.infer<typeof cartSchema>;

export type SimulatedOrder = z.infer<typeof orderSchema>;

export type ActionResult = { ok: true } | { ok: false; error: string };

export type CommerceProvider = {
  getProduct: () => CommerceProduct;
  addToCart: (variantId: string, quantity?: number) => Cart;
  updateLine: (lineId: string, quantity: number) => Cart;
  removeLine: (lineId: string) => Cart;
  checkout: (input: CheckoutValues) => SimulatedOrder;
};
