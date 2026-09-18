import { homeContent } from "@/content/home";
import { SectionShell } from "./SectionShell";

export function Develop() {
  const { title, body, developTime } = homeContent.develop;

  return (
    <SectionShell
      id={homeContent.develop.id}
      title={title}
      summary={`${body} · Tiempo: ${developTime ?? "—"}`}
      minHeight="min-h-[80svh]"
    />
  );
}
