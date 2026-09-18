import type { Metadata } from "next";
import { getFaqByTag } from "@/content/faq";
import { site } from "@/content/site";
import { Accordion } from "@/shared/components/ui/Accordion";

export const metadata: Metadata = {
  title: site.seo.soporte.title,
  description: site.seo.soporte.description,
};

export default function SoportePage() {
  const faqItems = getFaqByTag("support");

  return (
    <main className="content-max px-[clamp(16px,3vw,40px)] py-24">
      <p className="font-mono text-label uppercase text-ink-2">Soporte</p>
      <h1
        data-page-title
        tabIndex={-1}
        className="mt-2 font-display text-h1 text-ink"
      >
        ¿En qué podemos ayudarte?
      </h1>
      <p className="mt-4 max-w-prose text-lead text-ink-2">
        FAQ, envíos, devoluciones, garantía y contacto.
      </p>

      <Accordion items={faqItems} className="mt-12" />

      <section
        aria-labelledby="shipping-title"
        className="mt-16 border-t border-paper-2 pt-12"
      >
        <h2 id="shipping-title" className="font-display text-h3 text-ink">
          [[PENDIENTE: política de envío]]
        </h2>
      </section>

      <section
        aria-labelledby="returns-title"
        className="mt-12 border-t border-paper-2 pt-12"
      >
        <h2 id="returns-title" className="font-display text-h3 text-ink">
          [[PENDIENTE: política de devoluciones]]
        </h2>
      </section>

      <section
        aria-labelledby="warranty-title"
        className="mt-12 border-t border-paper-2 pt-12"
      >
        <h2 id="warranty-title" className="font-display text-h3 text-ink">
          [[PENDIENTE: garantía]]
        </h2>
      </section>

      <section
        aria-labelledby="contact-title"
        className="mt-12 border-t border-paper-2 pt-12"
      >
        <h2 id="contact-title" className="font-display text-h3 text-ink">
          [[PENDIENTE: contacto]]
        </h2>
      </section>
    </main>
  );
}
