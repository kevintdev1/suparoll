import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { site } from "@/content/site";
import { SectionShell } from "./SectionShell";

export function Colors() {
  const { title, body } = homeContent.colors;
  const priceLabel =
    product.price != null && product.currency != null
      ? `${product.price} ${product.currency}`
      : "[[PENDIENTE: precio de venta]]";

  return (
    <SectionShell
      id={homeContent.colors.id}
      title={title}
      summary={`${body} · ${priceLabel} · CTA: ${site.microcopy.addToCart}`}
      minHeight="min-h-[80svh]"
    >
      <ul className="mt-8 flex gap-4">
        {product.variants.map((variant) => (
          <li
            key={variant.id}
            className="flex items-center gap-2 rounded-lg border border-paper-2 px-4 py-2"
          >
            <span
              className="size-6 rounded-full border border-paper-2"
              style={{ backgroundColor: variant.colorHex }}
              aria-hidden
            />
            <span className="text-body text-ink">{variant.name}</span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
