import { productPageContent } from "@/content/product-page";
import { ProductHero } from "@/features/commerce/components/ProductHero";
import { commerce } from "@/features/commerce/lib";
import { buildProductJsonLd } from "@/features/commerce/lib/product-json-ld";
import { getAsset } from "@/shared/lib/assets";

export function ProductOverview() {
  const product = commerce.getProduct();
  const images = productPageContent.galleryAssetIds.map((id) => getAsset(id));

  return (
    <>
      <script type="application/ld+json">{buildProductJsonLd(product)}</script>
      <ProductHero
        product={product}
        images={images}
        shippingLabel={productPageContent.purchasePanel.shippingLabel}
        warrantyLabel={productPageContent.purchasePanel.warrantyLabel}
      />
    </>
  );
}
