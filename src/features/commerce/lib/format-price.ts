export function formatPrice(
  price: number | null,
  currency: string | null,
): string {
  if (price == null || currency == null) {
    return "[[PENDIENTE: precio de venta]]";
  }

  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency,
    }).format(price);
  } catch {
    return "[[PENDIENTE: precio de venta]]";
  }
}

export function sumLinePrices(prices: Array<number | null>): number | null {
  let total = 0;

  for (const price of prices) {
    if (price == null) {
      return null;
    }

    total += price;
  }

  return total;
}
