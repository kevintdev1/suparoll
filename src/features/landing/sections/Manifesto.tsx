import { homeContent } from "@/content/home";
import { RevealText } from "@/shared/components/ui/RevealText";

export function Manifesto() {
  const { id, body, accentWord } = homeContent.manifesto;

  return (
    <section
      id={id}
      aria-label="Manifiesto"
      className="flex min-h-[60svh] flex-col justify-center border-b border-paper-2 page-margin py-16"
    >
      <div className="prose-width">
        <RevealText
          accentWord={accentWord}
          className="font-display text-h2 text-ink"
        >
          {body}
        </RevealText>
      </div>
    </section>
  );
}
