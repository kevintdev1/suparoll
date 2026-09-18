import { homeContent } from "@/content/home";
import { FeaturesStack } from "@/features/landing/scenes/FeaturesStack";
import { RevealText } from "@/shared/components/ui/RevealText";

export function Features() {
  const { title, cards } = homeContent.features;

  return (
    <section
      id={homeContent.features.id}
      aria-labelledby="features-title"
      className="relative z-10 bg-paper"
    >
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-6 lg:px-8">
        <RevealText
          as="h2"
          id="features-title"
          className="mb-12 font-display text-h2 text-ink md:mb-16"
        >
          {title}
        </RevealText>

        <FeaturesStack cards={cards} />
      </div>
    </section>
  );
}
