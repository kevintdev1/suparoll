import type { Metadata } from "next";
import { site } from "@/content/site";
import { NotFoundReveal } from "@/features/landing/scenes/NotFoundReveal";
import { ButtonLink } from "@/shared/components/ui/ButtonLink";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.notFound.title,
  description: site.seo.notFound.description,
};

export default function NotFound() {
  const { notFoundTitle, notFoundBody, notFoundCta } = site.microcopy;

  return (
    <main
      id={MAIN_CONTENT_ID}
      className="flex min-h-svh flex-col items-center justify-center page-margin py-24 text-center"
    >
      <NotFoundReveal />
      <p className="mt-10 font-mono-label text-ink-2">404</p>
      <h1
        data-page-title
        tabIndex={-1}
        className="mt-4 font-display text-h1 text-ink"
      >
        {notFoundTitle}
      </h1>
      <p className="mt-4 max-w-prose text-lead text-ink-2">{notFoundBody}</p>
      <ButtonLink href="/" className="mt-8">
        {notFoundCta}
      </ButtonLink>
    </main>
  );
}
