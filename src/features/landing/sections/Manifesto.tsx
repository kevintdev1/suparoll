import { homeContent } from "@/content/home";
import { ManifestoReveal } from "../scenes/ManifestoReveal";

export function Manifesto() {
  const { id, body, accentWord } = homeContent.manifesto;

  return (
    <section
      id={id}
      aria-label="Manifiesto"
      className="flex min-h-[60svh] flex-col justify-center border-b border-paper-2 px-[clamp(16px,3vw,40px)] py-16"
    >
      <div className="prose-width">
        <ManifestoReveal body={body} accentWord={accentWord} />
      </div>
    </section>
  );
}
