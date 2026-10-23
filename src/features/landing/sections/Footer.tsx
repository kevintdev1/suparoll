import type { ReactNode } from "react";
import { homeContent } from "@/content/home";
import { type NavLink, site } from "@/content/site";
import { Link } from "@/shared/components/ui/Link";

type FooterProps = {
  newsletter?: ReactNode;
};

type FooterNavProps = {
  titleId: string;
  title: string;
  links: NavLink[];
};

function FooterNav({ titleId, title, links }: FooterNavProps) {
  return (
    <nav aria-labelledby={titleId}>
      <h2 id={titleId} className="font-mono-label text-paper/70">
        {title}
      </h2>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} tone="inverse-muted">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ newsletter }: FooterProps) {
  const { footer, microcopy } = site;
  const { id, socialLabel, navTitle, legalTitle } = homeContent.footer;

  return (
    <footer id={id} className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl page-margin py-16 md:py-24">
        <div
          data-anim="footer-wordmark"
          aria-hidden="true"
          className="overflow-hidden"
        >
          <p className="font-display text-mega text-paper/10">
            {footer.wordmark}
          </p>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-8">
          <div>
            <p className="text-lead text-paper">{footer.tagline}</p>
            {footer.social && footer.social.length > 0 ? (
              <nav aria-label={socialLabel} className="mt-6">
                <ul className="flex flex-wrap gap-4">
                  {footer.social.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        tone="inverse-muted"
                        className="font-mono-label"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>

          <FooterNav
            titleId={`${id}-nav-title`}
            title={navTitle}
            links={footer.links}
          />
          <FooterNav
            titleId={`${id}-legal-title`}
            title={legalTitle}
            links={footer.legalLinks}
          />
        </div>

        {footer.newsletter.enabled && newsletter ? (
          <div className="mt-12 border-t border-paper/10 pt-8 md:mt-16">
            <h2 className="font-mono-label text-paper/70">
              {footer.newsletter.title}
            </h2>
            <p className="mt-2 max-w-md text-small text-paper/70">
              {footer.newsletter.description}
            </p>
            {newsletter}
            <p className="mt-4 text-small text-paper/70">
              {microcopy.newsletterDemoNote}
            </p>
          </div>
        ) : null}

        <div className="mt-12 border-t border-paper/10 pt-8 md:mt-16">
          <p className="text-small text-paper/70">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
