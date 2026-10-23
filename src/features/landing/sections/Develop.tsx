import { homeContent } from "@/content/home";
import {
  DevelopReveal,
  type DevelopSnapshot,
} from "@/features/landing/scenes/DevelopReveal";
import { getAsset } from "@/shared/lib/assets";

const TITLE_ID = "develop-title";

function resolveSnapshot(
  assetId: string | null,
  fallbackAlt: string,
): DevelopSnapshot | null {
  if (!assetId) {
    return null;
  }

  const asset = getAsset(assetId);

  return {
    src: asset.src,
    alt: asset.alt.trim() || fallbackAlt,
    blurDataURL: asset.blurDataURL,
  };
}

export function Develop() {
  const {
    id,
    title,
    body,
    developSeconds,
    snapshotAssetId,
    snapshotAlt,
    placeholderLabel,
  } = homeContent.develop;

  return (
    <section
      id={id}
      data-theme="dark"
      aria-labelledby={TITLE_ID}
      className="relative z-15 bg-ink text-paper"
    >
      <DevelopReveal
        titleId={TITLE_ID}
        title={title}
        body={body}
        developSeconds={developSeconds}
        snapshot={resolveSnapshot(snapshotAssetId, snapshotAlt)}
        placeholderLabel={placeholderLabel}
      />
    </section>
  );
}
