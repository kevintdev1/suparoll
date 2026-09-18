import { homeContent } from "@/content/home";
import { site } from "@/content/site";
import { Link } from "@/shared/components/ui/Link";

export function Footer() {
  const { footer } = site;

  return (
    <footer
      id={homeContent.footer.id}
      className="fixed inset-x-0 bottom-0 z-0 bg-ink text-paper"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <div data-anim="footer-wordmark" className="overflow-hidden">
          <p className="font-display text-mega leading-none tracking-tight text-paper/10">
            {footer.wordmark}
          </p>
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-8">
          <div>
            <p className="text-lead text-paper">{footer.tagline}</p>
          </div>

          <nav aria-label="Enlaces de navegación">
            <p className="font-mono text-label uppercase tracking-wider text-paper/50">
              Navegación
            </p>
            <ul className="mt-4 space-y-2">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Enlaces legales">
            <p className="font-mono text-label uppercase tracking-wider text-paper/50">
              Legal
            </p>
            <ul className="mt-4 space-y-2">
              {footer.legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body text-paper/70 transition-colors hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {footer.newsletter.enabled && (
          <div className="mt-12 border-t border-paper/10 pt-8 md:mt-16">
            <p className="font-mono text-label uppercase tracking-wider text-paper/50">
              {footer.newsletter.title}
            </p>
            <p className="mt-2 max-w-md text-small text-paper/50">
              {footer.newsletter.description}
            </p>
            <p className="mt-4 text-small text-paper/30">
              {site.microcopy.newsletterDemoNote}
            </p>
          </div>
        )}

        <div className="mt-12 border-t border-paper/10 pt-8 md:mt-16">
          <p className="text-small text-paper/40">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
