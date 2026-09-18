import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { CtaFinalExit } from "@/features/landing/scenes/CtaFinalExit";
import { ButtonLink } from "@/shared/components/ui/ButtonLink";
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
      data-theme="dark"
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
          <ButtonLink href={cta.href} magnetic>
            {cta.label}
          </ButtonLink>
        </div>

        <p className="mt-8 max-w-md text-small text-paper/60">{trustLabel}</p>
      </div>

      <CtaFinalExit />
    </section>
  );
}
