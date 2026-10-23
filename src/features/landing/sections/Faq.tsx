import { getFaqByTag } from "@/content/faq";
import { homeContent } from "@/content/home";
import {
  type CoverStep,
  SectionCover,
} from "@/features/landing/scenes/SectionCover";
import { Accordion } from "@/shared/components/ui/Accordion";
import { RevealText } from "@/shared/components/ui/RevealText";

const TITLE_ID = "faq-title";

const COVER_DESKTOP: CoverStep = {
  scale: 0.96,
  scrim: 0.4,
  end: "+=100%",
  pin: true,
};

const COVER_MOBILE: CoverStep = { scale: 0.98, scrim: 0.24, end: "+=50%" };

export function Faq() {
  const items = getFaqByTag("home");

  return (
    <SectionCover
      id={homeContent.faq.id}
      aria-labelledby={TITLE_ID}
      desktop={COVER_DESKTOP}
      mobile={COVER_MOBILE}
      className="z-1 overflow-hidden bg-paper"
    >
      <div
        data-anim="cover-inner"
        className="mx-auto max-w-4xl page-margin py-24 md:py-32"
      >
        <RevealText
          as="h2"
          id={TITLE_ID}
          className="font-display text-h2 text-ink"
        >
          {homeContent.faq.title}
        </RevealText>

        <Accordion items={items} className="mt-12" />
      </div>
    </SectionCover>
  );
}
