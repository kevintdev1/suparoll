import { getFaqByTag } from "@/content/faq";
import { homeContent } from "@/content/home";
import { FaqCover } from "@/features/landing/scenes/FaqCover";
import { Accordion } from "@/shared/components/ui/Accordion";
import { RevealText } from "@/shared/components/ui/RevealText";

export function Faq() {
  const items = getFaqByTag("home");

  return (
    <section
      id={homeContent.faq.id}
      aria-labelledby="faq-title"
      className="relative z-[1] overflow-hidden bg-paper"
    >
      <div
        data-anim="faq-inner"
        className="mx-auto max-w-4xl px-4 py-24 md:px-6 md:py-32 lg:px-8"
      >
        <RevealText
          as="h2"
          id="faq-title"
          className="font-display text-h2 text-ink"
        >
          {homeContent.faq.title}
        </RevealText>

        <Accordion items={items} className="mt-12" />
      </div>

      <div
        data-anim="faq-scrim"
        className="pointer-events-none absolute inset-0 bg-ink/40 opacity-0"
        aria-hidden="true"
      />

      <FaqCover />
    </section>
  );
}
