import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { formatPrice } from "@/features/commerce";
import { CtaFinalExit } from "@/features/landing/scenes/CtaFinalExit";
import { ButtonLink } from "@/shared/components/ui/ButtonLink";
import { RevealText } from "@/shared/components/ui/RevealText";

export function CtaFinal() {
  const { id, headline, cta, trustLabel } = homeContent.ctaFinal;
  const priceLabel = formatPrice(product.price, product.currency);

  return (
    <CtaFinalExit
      id={id}
      footerId={homeContent.footer.id}
      data-theme="dark"
      aria-labelledby="cta-final-title"
      className="relative z-20 overflow-hidden bg-ink text-paper"
    >
      <div className="flex min-h-svh flex-col items-center justify-center page-margin py-24 text-center">
        <RevealText
          as="h2"
          id="cta-final-title"
          className="max-w-3xl font-display text-h1 text-paper"
        >
          {headline}
        </RevealText>

        <p className="mt-6 font-mono-label text-paper/70">{priceLabel}</p>

        <ButtonLink href={cta.href} magnetic className="mt-10">
          {cta.label}
        </ButtonLink>

        <p className="mt-8 max-w-md text-small text-paper/70">{trustLabel}</p>
      </div>
    </CtaFinalExit>
  );
}
