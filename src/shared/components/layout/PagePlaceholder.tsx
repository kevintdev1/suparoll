type PagePlaceholderProps = {
  title: string;
  description?: string;
  sections?: { id: string; title: string }[];
};

export function PagePlaceholder({
  title,
  description,
  sections,
}: PagePlaceholderProps) {
  return (
    <main className="content-max px-[clamp(16px,3vw,40px)] py-24">
      <p className="font-mono text-label uppercase text-ink-2">Placeholder</p>
      <h1 className="mt-2 font-display text-h1 text-ink">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-prose text-lead text-ink-2">{description}</p>
      ) : null}
      {sections && sections.length > 0 ? (
        <ol className="mt-12 list-decimal space-y-3 pl-6 text-body text-ink-2">
          {sections.map((section) => (
            <li key={section.id}>
              <span className="font-mono text-label text-shutter">
                {section.id}
              </span>
              {" — "}
              {section.title}
            </li>
          ))}
        </ol>
      ) : null}
    </main>
  );
}
