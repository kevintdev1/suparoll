import { getDebugFlag } from "@/shared/lib/motion/debug";

export function isDebugSoldOut(): boolean {
  return getDebugFlag() === "agotado";
}

export function isDebugCartError(): boolean {
  return getDebugFlag() === "cart-error";
}
