import { homeContent } from "@/content/home";
import { productSpecEntries } from "@/content/product-page";
import { RevealText } from "@/shared/components/ui/RevealText";

export function Specs() {
  const { id, title, subtitle } = homeContent.specs;

  return (
    <section
      id={id}
      aria-labelledby="specs-title"
      className="relative z-5 min-h-svh bg-paper"
    >
      <div className="mx-auto max-w-7xl page-margin py-24 md:py-32">
        <header className="max-w-2xl">
          <RevealText
            as="h2"
            id="specs-title"
            className="font-display text-h2 text-ink"
          >
            {title}
          </RevealText>
          <RevealText delay={0.1} className="mt-4 text-lead text-ink-2">
            {subtitle}
          </RevealText>
        </header>

        <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {productSpecEntries.map(({ key, label, value }) => (
            <div key={key} className="border-t border-paper-2 pt-4">
              <dt className="font-mono-label text-ink-2">{label}</dt>
              <dd className="mt-2 text-body text-ink">{value ?? "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
