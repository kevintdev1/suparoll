import { commerceContent } from "@/content/commerce";

export function formatPrice(
  price: number | null,
  currency: string | null,
): string {
  if (price == null || currency == null) {
    return commerceContent.price.onRequest;
  }

  try {
    return new Intl.NumberFormat("es", {
      style: "currency",
      currency,
    }).format(price);
  } catch {
    return commerceContent.price.onRequest;
  }
}
