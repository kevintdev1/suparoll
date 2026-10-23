import type { CommerceProduct } from "../types";

export function buildProductJsonLd(product: CommerceProduct): string {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.model ?? product.brand,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
  };

  return JSON.stringify(jsonLd).replace(/</g, "\\u003c");
}
