import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { RevealText } from "@/shared/components/ui/RevealText";

export function Specs() {
  const { title, subtitle } = homeContent.specs;
  const specEntries = [
    { label: "Película", value: product.specs.filmType },
    { label: "Lente", value: product.specs.lens },
    { label: "Flash", value: product.specs.flash },
    { label: "Batería", value: product.specs.battery },
    { label: "Dimensiones", value: product.specs.dimensions },
    { label: "Peso", value: product.specs.weight },
  ];

  return (
    <section
      id={homeContent.specs.id}
      aria-labelledby="specs-title"
      className="relative z-[5] min-h-svh bg-paper"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32 lg:px-8">
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
          {specEntries.map(({ label, value }, index) => (
            <div
              key={label}
              className="border-t border-paper-2 pt-4"
              style={
                {
                  "--reveal-delay": `${0.2 + index * 0.05}s`,
                } as React.CSSProperties
              }
            >
              <dt className="font-mono text-label uppercase tracking-wider text-ink-2">
                {label}
              </dt>
              <dd className="mt-2 text-body text-ink">
                {value ?? "[[PENDIENTE]]"}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
