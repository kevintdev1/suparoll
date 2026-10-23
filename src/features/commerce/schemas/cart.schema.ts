import { z } from "zod";

export const shippingStatusSchema = z.enum([
  "pending",
  "flat",
  "free",
  "threshold",
]);

export const cartLineSchema = z.object({
  id: z.string().min(1),
  productId: z.string().min(1),
  variantId: z.string().min(1),
  name: z.string().min(1),
  variantName: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nullable(),
  currency: z.string().nullable(),
  imageAssetId: z.string().min(1),
  colorHex: z.string().min(1),
});

export const cartSchema = z.object({
  lines: z.array(cartLineSchema),
  itemCount: z.number().int().nonnegative(),
  subtotal: z.number().nullable(),
  shippingStatus: shippingStatusSchema,
  shippingLabel: z.string().min(1),
  total: z.number().nullable(),
});

export const orderSchema = z.object({
  orderId: z.string().min(1),
  lines: z.array(cartLineSchema),
  subtotal: z.number().nullable(),
  shippingLabel: z.string().min(1),
  currency: z.string().nullable(),
  contactName: z.string().min(1),
});
