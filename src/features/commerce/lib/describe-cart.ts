import { commerceContent } from "@/content/commerce";
import type { Cart } from "../types";
import { getCartCurrency } from "./cart-math";
import { formatPrice } from "./format-price";

export function describeCart(cart: Cart): string {
  const { cart: copy, summary } = commerceContent;
  const count = cart.itemCount;

  if (count === 0) {
    return copy.empty;
  }

  const unit = count === 1 ? copy.itemSingular : copy.itemPlural;
  const total = formatPrice(cart.total, getCartCurrency(cart.lines));

  return `${count} ${unit}. ${summary.total} ${total}`;
}
