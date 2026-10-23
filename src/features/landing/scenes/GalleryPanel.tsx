import { ButtonLink } from "@/shared/components/ui/ButtonLink";
import { RevealText } from "@/shared/components/ui/RevealText";

type GalleryPanelProps = {
  titleId: string;
  title: string;
  phrase: string;
  cta: { label: string; href: string };
};

export function GalleryPanel({
  titleId,
  title,
  phrase,
  cta,
}: GalleryPanelProps) {
  return (
    <div
      data-anim="gallery-panel"
      className="flex shrink-0 flex-col justify-between gap-12 bg-paper page-margin py-16 md:h-full md:w-2/5 md:py-24"
    >
      <div className="space-y-6">
        <RevealText
          as="h2"
          id={titleId}
          scrollStart="top 80%"
          className="font-display text-h1 uppercase text-ink"
        >
          {title}
        </RevealText>
        <RevealText
          scrollStart="top 80%"
          className="max-w-[18ch] font-display text-h3 text-ink-2"
        >
          {phrase}
        </RevealText>
      </div>

      <ButtonLink href={cta.href} variant="primary" className="w-fit">
        {cta.label}
      </ButtonLink>
    </div>
  );
}
