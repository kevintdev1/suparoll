import { ArrowRight, Camera, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/shared/components/ui/Button";
import { GridOverlay } from "@/shared/components/ui/GridOverlay";
import { Link } from "@/shared/components/ui/Link";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: "Styleguide — Suparoll",
  robots: { index: false },
};

const palette = [
  { name: "paper", token: "--color-paper", className: "bg-paper text-ink" },
  {
    name: "paper-2",
    token: "--color-paper-2",
    className: "bg-paper-2 text-ink",
  },
  { name: "ink", token: "--color-ink", className: "bg-ink text-paper" },
  {
    name: "ink-2",
    token: "--color-ink-2",
    className: "bg-paper text-ink-2 border border-paper-2",
  },
  {
    name: "shutter",
    token: "--color-shutter",
    className: "bg-shutter text-paper",
  },
  {
    name: "exposure",
    token: "--color-exposure",
    className: "bg-exposure text-ink",
  },
  {
    name: "frame",
    token: "--color-frame",
    className: "bg-frame text-ink border border-paper-2",
  },
  {
    name: "scrim",
    token: "--color-scrim",
    className: "bg-scrim text-paper",
  },
] as const;

const typeScale = [
  { label: "mega", className: "font-display text-mega", sample: "SUPAROLL" },
  {
    label: "h1",
    className: "font-display text-h1",
    sample: "Galería de revelado",
  },
  { label: "h2", className: "font-display text-h2", sample: "Cada instante" },
  {
    label: "h3",
    className: "font-display text-h3",
    sample: "Fotografía instantánea",
  },
  {
    label: "lead",
    className: "text-lead",
    sample: "Texto lead para introducciones editoriales.",
  },
  {
    label: "body",
    className: "text-body prose-width",
    sample:
      "Cuerpo de texto con medida de lectura cómoda. El sitio se comporta como una fotografía instantánea: empieza blanco y silencioso, y el contenido se revela con el scroll.",
  },
  {
    label: "small",
    className: "text-small",
    sample: "Texto auxiliar y metadatos.",
  },
  {
    label: "label",
    className: "font-mono-label text-ink-2",
    sample: "Especificaciones",
  },
] as const;

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="section-gap border-t border-paper-2">
      <div className="content-max page-margin">
        <h2 className="font-display text-h2">{title}</h2>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <>
      <GridOverlay />

      <main id={MAIN_CONTENT_ID} className="pb-32">
        <header className="section-gap page-margin">
          <div className="content-max">
            <p className="font-mono-label text-ink-2">
              Suparoll / Design system
            </p>
            <h1 data-page-title className="mt-4 font-display text-h1">
              Styleguide
            </h1>
            <p className="mt-6 prose-width text-lead text-ink-2">
              Tokens aprobados en{" "}
              <code className="font-mono text-small">
                docs/02-direccion-de-arte.md
              </code>
              . Presiona{" "}
              <kbd className="rounded-input border border-paper-2 px-2 py-0.5 font-mono text-small">
                G
              </kbd>{" "}
              para mostrar u ocultar la retícula.
            </p>
          </div>
        </header>

        <Section title="Paleta">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {palette.map((swatch) => (
              <div key={swatch.name} className="space-y-3">
                <div
                  className={`flex h-24 items-end rounded-card p-4 ${swatch.className}`}
                >
                  <span className="font-mono-label">{swatch.name}</span>
                </div>
                <p className="font-mono text-small text-ink-2">
                  {swatch.token}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Tipografía">
          <div className="space-y-12">
            {typeScale.map((item) => (
              <div
                key={item.label}
                className="grid gap-4 md:grid-cols-[8rem_1fr]"
              >
                <p className="font-mono-label pt-2 text-ink-2">{item.label}</p>
                <p className={item.className}>{item.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Botones">
          <p className="mb-6 text-small text-ink-2">
            Usa Tab para ver el anillo de foco (2px shutter, offset 3px).
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Button variant="primary">Comprar ahora</Button>
            <Button variant="secondary">Ver especificaciones</Button>
            <Button variant="primary" disabled>
              Agotado
            </Button>
          </div>
        </Section>

        <Section title="Enlaces">
          <div className="flex flex-wrap gap-8 text-lead">
            <Link href="/">Volver al inicio</Link>
            <Link href="#paleta">Explorar galería</Link>
          </div>
        </Section>

        <Section title="Iconografía">
          <div className="flex flex-wrap items-center gap-8 text-ink">
            <Camera aria-hidden="true" className="size-6" strokeWidth={1.5} />
            <ShoppingBag
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.5}
            />
            <ArrowRight
              aria-hidden="true"
              className="size-5"
              strokeWidth={1.5}
            />
            <span className="font-mono-label text-ink-2">
              lucide-react · 1.5px stroke
            </span>
          </div>
        </Section>

        <Section title="Marco instantánea">
          <div className="max-w-md">
            <div className="instant-frame aspect-4/5 bg-paper-2" />
          </div>
        </Section>

        <Section title="Contraste WCAG AA">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-small">
              <thead>
                <tr className="border-b border-paper-2 font-mono-label text-ink-2">
                  <th className="pb-3 pr-4">Combinación</th>
                  <th className="pb-3 pr-4">Ratio</th>
                  <th className="pb-3">Resultado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-2">
                <tr>
                  <td className="py-3 pr-4">ink / paper</td>
                  <td className="py-3 pr-4">16.7:1</td>
                  <td className="py-3">AA ✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">ink-2 / paper</td>
                  <td className="py-3 pr-4">6.1:1</td>
                  <td className="py-3">AA ✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">paper / ink</td>
                  <td className="py-3 pr-4">16.7:1</td>
                  <td className="py-3">AA ✓</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">shutter / paper</td>
                  <td className="py-3 pr-4">3.6:1</td>
                  <td className="py-3">Solo acentos / texto grande</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">exposure / paper</td>
                  <td className="py-3 pr-4">1.7:1</td>
                  <td className="py-3">No usar como texto</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>
      </main>
    </>
  );
}
