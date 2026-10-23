import { type FeatureCard, homeContent } from "@/content/home";
import {
  type FeatureStackCard,
  FeaturesStack,
} from "@/features/landing/scenes/FeaturesStack";
import { RevealText } from "@/shared/components/ui/RevealText";
import { getAsset } from "@/shared/lib/assets";

function toStackCard(card: FeatureCard): FeatureStackCard {
  const asset = card.imageAssetId ? getAsset(card.imageAssetId) : null;

  return {
    number: card.number,
    title: card.title,
    body: card.body,
    image: asset
      ? {
          src: asset.src,
          alt: asset.alt.trim() || card.title,
          width: asset.width,
          height: asset.height,
        }
      : null,
  };
}

export function Features() {
  const { id, title, cards } = homeContent.features;

  return (
    <section
      id={id}
      aria-labelledby="features-title"
      className="relative z-10 bg-paper"
    >
      <div className="mx-auto max-w-7xl page-margin py-24">
        <RevealText
          as="h2"
          id="features-title"
          className="mb-12 font-display text-h2 text-ink md:mb-16"
        >
          {title}
        </RevealText>

        <FeaturesStack cards={cards.map(toStackCard)} />
      </div>
    </section>
  );
}
