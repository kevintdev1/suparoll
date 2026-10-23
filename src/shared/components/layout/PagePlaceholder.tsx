type PagePlaceholderProps = {
  title: string;
  description?: string;
};

export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return (
    <>
      <h1 data-page-title className="font-display text-h1 text-ink">
        {title}
      </h1>
      {description ? (
        <p className="mt-4 prose-width text-lead text-ink-2">{description}</p>
      ) : null}
    </>
  );
}
