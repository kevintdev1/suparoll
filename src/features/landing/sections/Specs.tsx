import { homeContent } from "@/content/home";
import { product } from "@/content/product";
import { SectionShell } from "./SectionShell";

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
    <SectionShell
      id={homeContent.specs.id}
      title={title}
      summary={subtitle}
      minHeight="min-h-[80svh]"
    >
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {specEntries.map(({ label, value }) => (
          <div key={label}>
            <dt className="font-mono text-label uppercase text-ink-2">
              {label}
            </dt>
            <dd className="mt-1 text-body text-ink">
              {value ?? "[[PENDIENTE]]"}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
