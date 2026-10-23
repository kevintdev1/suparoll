import { productPageContent } from "@/content/product-page";
import { RevealImage } from "@/shared/components/ui/RevealImage";
import { getAssetsByGroup } from "@/shared/lib/assets";
import { ProductSection } from "./ProductSection";

export function SamplePhotos() {
  const { id, title, description, count, altFallback } =
    productPageContent.samplePhotos;
  const photos = getAssetsByGroup("gallery").slice(0, count);

  return (
    <ProductSection id={id} title={title} subtitle={description} width="wide">
      <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
        {photos.map((photo, index) => (
          <RevealImage
            key={photo.id}
            src={photo.src}
            alt={photo.alt || altFallback.replace("{n}", String(index + 1))}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 64rem) 25vw, 50vw"
          />
        ))}
      </div>
    </ProductSection>
  );
}
