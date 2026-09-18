import { homeContent } from "@/content/home";
import { SectionShell } from "./SectionShell";

export function Gallery() {
  const { title, phrase, cta, photoCount } = homeContent.gallery;

  return (
    <SectionShell
      id={homeContent.gallery.id}
      title="Galería de columnas"
      summary={`${title} — ${phrase} · CTA: ${cta.label} · ${photoCount} fotos`}
      minHeight="min-h-[100svh]"
    />
  );
}
