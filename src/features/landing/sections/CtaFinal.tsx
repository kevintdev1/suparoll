import NextLink from "next/link";
import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { CtaFinalExit } from "@/features/landing/scenes/CtaFinalExit";
import { RevealText } from "@/shared/components/ui/RevealText";

export function CtaFinal() {
  const { headline, cta, trustLabel } = homeContent.ctaFinal;
  const priceLabel =
    product.price != null && product.currency != null
      ? `${product.price} ${product.currency}`
      : "[[PENDIENTE: precio de venta]]";

  return (
    <section
      id={homeContent.ctaFinal.id}
      aria-labelledby="cta-final-title"
      className="relative z-20 overflow-hidden bg-ink text-paper"
    >
      <div
        data-anim="cta-inner"
        className="flex min-h-svh flex-col items-center justify-center px-4 py-24 text-center md:px-6 lg:px-8"
      >
        <RevealText
          as="h2"
          id="cta-final-title"
          className="max-w-3xl font-display text-h1 text-paper"
        >
          {headline}
        </RevealText>

        <p className="mt-6 font-mono text-label uppercase tracking-wider text-paper/70">
          {priceLabel}
        </p>

        <div className="mt-10">
          <NextLink
            href={cta.href}
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-pill bg-shutter px-10 text-body font-medium text-paper transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus-visible:focus-ring md:h-16 md:px-12 md:text-lead"
          >
            <span className="relative z-10">{cta.label}</span>
          </NextLink>
        </div>

        <p className="mt-8 max-w-md text-small text-paper/60">{trustLabel}</p>
      </div>

      <CtaFinalExit />
    </section>
  );
}
