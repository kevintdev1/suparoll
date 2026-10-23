import { productPageContent, productSpecEntries } from "@/content/product-page";
import { ProductSection } from "./ProductSection";

export function ProductSpecs() {
  const { id, title, subtitle } = productPageContent.specs;

  return (
    <ProductSection id={id} title={title} subtitle={subtitle} width="medium">
      <dl className="mt-12 grid gap-6 sm:grid-cols-2">
        {productSpecEntries.map(({ key, label, value }) => (
          <div key={key} className="border-t border-paper-2 pt-4">
            <dt className="font-mono-label text-ink-2">{label}</dt>
            <dd className="mt-2 text-body text-ink">{value ?? "—"}</dd>
          </div>
        ))}
      </dl>
    </ProductSection>
  );
}
