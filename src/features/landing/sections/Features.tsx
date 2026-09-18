import { homeContent } from "@/content/home";
import { SectionShell } from "./SectionShell";

export function Features() {
  const { title, cards } = homeContent.features;

  return (
    <SectionShell
      id={homeContent.features.id}
      title={title}
      minHeight="min-h-[80svh]"
    >
      <ul className="mt-8 grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <li
            key={card.number}
            className="rounded-lg border border-paper-2 p-6"
          >
            <p className="font-mono text-label text-shutter">{card.number}</p>
            <p className="mt-2 font-display text-h3 text-ink">{card.title}</p>
            <p className="mt-2 text-small text-ink-2">{card.body}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
