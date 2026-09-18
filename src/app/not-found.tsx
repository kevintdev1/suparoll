import type { Metadata } from "next";
import { site } from "@/content/site";
import { NotFoundReveal } from "@/features/landing/scenes/NotFoundReveal";

export const metadata: Metadata = {
  title: site.seo.notFound.title,
  description: site.seo.notFound.description,
};

export default function NotFound() {
  return <NotFoundReveal />;
}
