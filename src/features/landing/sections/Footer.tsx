import { homeContent } from "@/content/home";
import { site } from "@/content/site";
import { SectionShell } from "./SectionShell";

export function Footer() {
  const { footer } = site;

  return (
    <SectionShell
      id={homeContent.footer.id}
      title="Footer revelado"
      summary={`${footer.wordmark} · Newsletter demo · ${footer.copyright}`}
      minHeight="min-h-[50svh]"
    >
      <nav
        aria-label="Enlaces del footer"
        className="mt-8 flex flex-wrap gap-4"
      >
        {footer.links.map((link) => (
          <span key={link.href} className="text-small text-ink-2">
            {link.label}
          </span>
        ))}
        {footer.legalLinks.map((link) => (
          <span key={link.href} className="text-small text-ink-2">
            {link.label}
          </span>
        ))}
      </nav>
      {footer.newsletter.enabled ? (
        <p className="mt-6 text-small text-ink-2">
          {footer.newsletter.title}: {site.microcopy.newsletterDemoNote}
        </p>
      ) : null}
    </SectionShell>
  );
}
