import { homeContent } from "@/content/home";
import { SectionShell } from "./SectionShell";

export function Preloader() {
  const { wordmark } = homeContent.preloader;

  return (
    <SectionShell
      id={homeContent.preloader.id}
      title="Preloader"
      summary={`Wordmark: ${wordmark} · Contador 0–100`}
      minHeight="min-h-[100svh]"
    />
  );
}
