import { getFaqByTag } from "@/content/faq";
import { productPageContent } from "@/content/product-page";
import { ProductSection } from "./ProductSection";

export function ProductFaq() {
  const { id, title } = productPageContent.faq;
  const items = getFaqByTag("product");

  return (
    <ProductSection id={id} title={title}>
      <dl className="mt-12 divide-y divide-paper-2">
        {items.map((item) => (
          <div key={item.id} className="py-6">
            <dt className="font-display text-h3 text-ink">{item.question}</dt>
            <dd className="mt-3 text-body text-ink-2">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </ProductSection>
  );
}
