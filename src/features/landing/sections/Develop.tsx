import { homeContent } from "@/content/home";
import { DevelopReveal } from "@/features/landing/scenes/DevelopReveal";

export function Develop() {
  const { title, body, developTime, snapshotAssetId } = homeContent.develop;

  return (
    <section
      id={homeContent.develop.id}
      aria-labelledby="develop-title"
      className="relative z-[15] bg-ink text-paper"
    >
      <h2 id="develop-title" className="sr-only">
        {title}
      </h2>

      <DevelopReveal
        title={title}
        body={body}
        snapshotAssetId={snapshotAssetId}
        developTime={developTime}
      />
    </section>
  );
}
