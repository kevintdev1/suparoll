import { homeContent } from "@/content/home";
import { productPageContent } from "@/content/product-page";
import { commerce } from "@/features/commerce";
import {
  type ColorFrame,
  ColorsScene,
} from "@/features/landing/scenes/ColorsScene";
import { getAsset } from "@/shared/lib/assets";

export function Colors() {
  const { id, title, body } = homeContent.colors;
  const product = commerce.getProduct();
  const frames: ColorFrame[] = product.variants.map((variant) => {
    const asset = getAsset(variant.imageAssetId);

    return {
      variantId: variant.id,
      colorHex: variant.colorHex,
      src: asset.src,
      alt: asset.alt,
      width: asset.width,
      height: asset.height,
      blurDataURL: asset.blurDataURL,
    };
  });

  return (
    <section id={id} aria-labelledby="colors-title" className="relative z-4">
      <div className="grid content-max gap-12 page-margin py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-7">
          <h2 id="colors-title" className="font-display text-h2 text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-md text-body text-ink-2">{body}</p>
        </div>

        <ColorsScene
          product={product}
          frames={frames}
          shippingLabel={productPageContent.purchasePanel.shippingLabel}
          warrantyLabel={productPageContent.purchasePanel.warrantyLabel}
        />
      </div>
    </section>
  );
}
