import { homeContent } from "@/content/home";
import { SocialReviews } from "@/features/landing/scenes/SocialReviews";
import { RevealText } from "@/shared/components/ui/RevealText";

export function Social() {
  const { id, title, reviews } = homeContent.social;

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <section
      id={id}
      aria-labelledby="social-title"
      className="relative z-1 bg-paper"
    >
      <div className="mx-auto max-w-7xl page-margin py-24 md:py-32">
        <RevealText
          as="h2"
          id="social-title"
          className="font-display text-h2 text-ink"
        >
          {title}
        </RevealText>

        <SocialReviews reviews={reviews} />
      </div>
    </section>
  );
}
