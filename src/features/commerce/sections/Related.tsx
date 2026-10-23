import { product } from "@/content/product";
import { productPageContent } from "@/content/product-page";
import { formatPrice } from "@/features/commerce/lib";
import { ProductSection } from "./ProductSection";

export function Related() {
  const { id, title } = productPageContent.related;

  if (product.accessories.length === 0) {
    return null;
  }

  return (
    <ProductSection id={id} title={title}>
      <ul className="mt-8 space-y-4">
        {product.accessories.map((accessory) => (
          <li
            key={accessory.id}
            className="flex items-baseline justify-between gap-4 border-t border-paper-2 pt-4"
          >
            <span className="text-body text-ink">{accessory.name}</span>
            <span className="font-mono-label text-ink-2">
              {formatPrice(accessory.price, product.currency)}
            </span>
          </li>
        ))}
      </ul>
    </ProductSection>
  );
}
