import type { ReactNode } from "react";
import { RevealText } from "@/shared/components/ui/RevealText";

type ProductSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  width?: "narrow" | "medium" | "wide";
  children: ReactNode;
};

const WIDTHS = {
  narrow: "mx-auto max-w-3xl",
  medium: "mx-auto max-w-5xl",
  wide: "content-max",
} as const;

export function ProductSection({
  id,
  title,
  subtitle,
  width = "narrow",
  children,
}: ProductSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="page-margin bg-paper py-24"
    >
      <div className={WIDTHS[width]}>
        <RevealText
          as="h2"
          id={titleId}
          className="font-display text-h2 text-ink"
        >
          {title}
        </RevealText>
        {subtitle ? (
          <p className="mt-4 max-w-xl text-body text-ink-2">{subtitle}</p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
