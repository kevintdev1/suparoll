import { getFaqByTag } from "@/content/faq";
import { homeContent } from "@/content/home";
import { FaqCover } from "@/features/landing/scenes/FaqCover";
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

        <dl className="mt-12 divide-y divide-paper-2">
          {items.map((item) => (
            <div key={item.id} className="py-6">
              <dt className="font-display text-h3 text-ink">{item.question}</dt>
              <dd className="mt-3 text-body text-ink-2">{item.answer}</dd>
            </div>
          ))}
        </dl>
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
