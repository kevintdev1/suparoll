import { getFaqByTag } from "@/content/faq";
import { homeContent } from "@/content/home";
import { SectionShell } from "./SectionShell";

export function Faq() {
  const items = getFaqByTag("home");

  return (
    <SectionShell
      id={homeContent.faq.id}
      title={homeContent.faq.title}
      minHeight="min-h-[60svh]"
    >
      <ul className="mt-8 divide-y divide-paper-2">
        {items.map((item) => (
          <li key={item.id} className="py-4">
            <p className="font-display text-h3 text-ink">{item.question}</p>
            <p className="mt-2 text-body text-ink-2">{item.answer}</p>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
