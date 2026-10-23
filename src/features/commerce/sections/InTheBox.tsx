import { product } from "@/content/product";
import { productPageContent } from "@/content/product-page";
import { ProductSection } from "./ProductSection";

export function InTheBox() {
  const { id, title, subtitle, items } = productPageContent.inTheBox;
  const boxItems = product.specs.inTheBox ?? items;

  if (!boxItems || boxItems.length === 0) {
    return null;
  }

  return (
    <ProductSection id={id} title={title} subtitle={subtitle}>
      <ul className="mt-8 space-y-3 text-body text-ink">
        {boxItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </ProductSection>
  );
}
