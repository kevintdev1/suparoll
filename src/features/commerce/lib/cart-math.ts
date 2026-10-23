import type { CartLine } from "../types";

export function getLineTotal(line: CartLine): number | null {
  return line.unitPrice == null ? null : line.unitPrice * line.quantity;
}

export function sumPrices(prices: Array<number | null>): number | null {
  let total = 0;

  for (const price of prices) {
    if (price == null) {
      return null;
    }

    total += price;
  }

  return total;
}

export function getCartCurrency(lines: CartLine[]): string | null {
  return lines[0]?.currency ?? null;
}
