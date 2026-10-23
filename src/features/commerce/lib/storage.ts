import { cartSchema, orderSchema } from "../schemas/cart.schema";
import type { Cart, SimulatedOrder } from "../types";

const CART_STORAGE_KEY = "suparoll:cart:v1";
const ORDER_STORAGE_KEY = "suparoll:last-order:v1";

type StorageKind = "localStorage" | "sessionStorage";

function readJson(kind: StorageKind, key: string): unknown {
  try {
    const raw = window[kind].getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(kind: StorageKind, key: string, value: unknown): void {
  try {
    window[kind].setItem(key, JSON.stringify(value));
  } catch {}
}

export function loadCart(): Cart | null {
  if (typeof window === "undefined") {
    return null;
  }

  const parsed = cartSchema.safeParse(
    readJson("localStorage", CART_STORAGE_KEY),
  );
  return parsed.success ? parsed.data : null;
}

export function saveCart(cart: Cart): void {
  if (typeof window === "undefined") {
    return;
  }

  writeJson("localStorage", CART_STORAGE_KEY, cart);
}

export function loadOrder(): SimulatedOrder | null {
  if (typeof window === "undefined") {
    return null;
  }

  const parsed = orderSchema.safeParse(
    readJson("sessionStorage", ORDER_STORAGE_KEY),
  );
  return parsed.success ? parsed.data : null;
}

export function saveOrder(order: SimulatedOrder): void {
  if (typeof window === "undefined") {
    return;
  }

  writeJson("sessionStorage", ORDER_STORAGE_KEY, order);
}
