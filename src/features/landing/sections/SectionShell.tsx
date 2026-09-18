type SectionShellProps = {
  id: string;
  title: string;
  summary?: string;
  minHeight?: string;
  className?: string;
  children?: React.ReactNode;
};

export function SectionShell({
  id,
  title,
  summary,
  minHeight = "min-h-[80svh]",
  className,
  children,
}: SectionShellProps) {
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`flex ${minHeight} flex-col justify-center border-b border-paper-2 px-[clamp(16px,3vw,40px)] py-16${className ? ` ${className}` : ""}`}
    >
      <p className="font-mono text-label uppercase text-ink-2">{id}</p>
      <h2 id={headingId} className="mt-2 font-display text-h2 text-ink">
        {title}
      </h2>
      {summary ? (
        <p className="mt-4 max-w-prose text-body text-ink-2">{summary}</p>
      ) : null}
      {children}
    </section>
  );
}
