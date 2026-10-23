import type { Metadata } from "next";
import { site } from "@/content/site";
import {
  InTheBox,
  ProductFaq,
  ProductOverview,
  ProductSpecs,
  Related,
  SamplePhotos,
} from "@/features/commerce";
import { MAIN_CONTENT_ID } from "@/shared/lib/navigation";

export const metadata: Metadata = {
  title: site.seo.camara.title,
  description: site.seo.camara.description,
};

export default function CamaraPage() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      className="pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0"
    >
      <ProductOverview />
      <InTheBox />
      <ProductSpecs />
      <SamplePhotos />
      <ProductFaq />
      <Related />
    </main>
  );
}
