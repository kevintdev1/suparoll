import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { SectionShell } from "./SectionShell";

export function CtaFinal() {
  const { headline, cta, trustLabel } = homeContent.ctaFinal;
  const priceLabel =
    product.price != null && product.currency != null
      ? `${product.price} ${product.currency}`
      : "[[PENDIENTE: precio de venta]]";

  return (
    <SectionShell
      id={homeContent.ctaFinal.id}
      title="Cierre"
      summary={`${headline} · ${priceLabel} · ${cta.label} · ${trustLabel}`}
      minHeight="min-h-[80svh]"
    />
  );
}
