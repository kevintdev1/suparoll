import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.seo.notFound.title,
  description: site.seo.notFound.description,
};

export default function NotFound() {
  const { notFoundTitle, notFoundBody, notFoundCta } = site.microcopy;

  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-[clamp(16px,3vw,40px)] py-24 text-center">
      <p className="font-mono text-label uppercase text-ink-2">404</p>
      <h1 className="mt-4 font-display text-h1 text-ink">{notFoundTitle}</h1>
      <p className="mt-4 max-w-prose text-lead text-ink-2">{notFoundBody}</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-pill bg-ink px-8 py-3 text-body text-paper"
      >
        {notFoundCta}
      </Link>
    </main>
  );
}
