import { z } from "zod";
import type { Cart, SimulatedOrder } from "../types";

export const CART_STORAGE_KEY = "suparoll:cart:v1";
export const ORDER_STORAGE_KEY = "suparoll:last-order:v1";

const cartLineSchema = z.object({
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

const cartSchema = z.object({
  lines: z.array(cartLineSchema),
  itemCount: z.number().int().nonnegative(),
  subtotal: z.number().nullable(),
  shippingStatus: z.enum(["pending", "flat", "free", "threshold"]),
  shippingLabel: z.string().min(1),
  total: z.number().nullable(),
});

const orderSchema = z.object({
  orderId: z.string().min(1),
  lines: z.array(cartLineSchema),
  subtotal: z.number().nullable(),
  shippingLabel: z.string().min(1),
  currency: z.string().nullable(),
  contactName: z.string().min(1),
});

function readJson(key: string): unknown {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota, private mode, or disabled storage: keep working in memory.
  }
}

export function loadCart(): Cart | null {
  if (typeof window === "undefined") {
    return null;
  }

  const parsed = cartSchema.safeParse(readJson(CART_STORAGE_KEY));
  return parsed.success ? parsed.data : null;
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") {
    return;
  }

  writeJson(CART_STORAGE_KEY, cart);
}

export function loadOrder(): SimulatedOrder | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(ORDER_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = orderSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function saveOrder(order: SimulatedOrder): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  } catch {
    // Same as cart: ignore storage failures.
  }
}
