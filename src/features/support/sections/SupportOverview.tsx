import { getFaqByTag } from "@/content/faq";
import { supportContent } from "@/content/support";
import { Accordion } from "@/shared/components/ui/Accordion";

export function SupportOverview() {
  const faqItems = getFaqByTag("support");

  return (
    <>
      <h1 data-page-title className="font-display text-h1 text-ink">
        {supportContent.title}
      </h1>
      <p className="mt-4 prose-width text-lead text-ink-2">
        {supportContent.subtitle}
      </p>

      <Accordion items={faqItems} headingLevel="h2" className="mt-12" />

      {supportContent.sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`${section.id}-title`}
          className="mt-16 border-t border-paper-2 pt-12"
        >
          <h2
            id={`${section.id}-title`}
            className="font-display text-h3 text-ink"
          >
            {section.title}
          </h2>
          <p className="mt-4 prose-width text-body text-ink-2">
            {section.body}
          </p>
        </section>
      ))}
    </>
  );
}
