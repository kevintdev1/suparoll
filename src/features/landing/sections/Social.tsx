import { homeContent } from "@/content/home";
import { SectionShell } from "./SectionShell";

export function Social() {
  const { title, reviews } = homeContent.social;

  return (
    <SectionShell
      id={homeContent.social.id}
      title={title}
      summary={
        reviews
          ? `${reviews.length} reseñas`
          : "[[PENDIENTE: testimonios / reseñas — se ocultará en producción si vacío]]"
      }
      minHeight="min-h-[60svh]"
    />
  );
}
