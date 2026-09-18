import { homeContent } from "@/content/home";
import { productPageContent } from "@/content/product-page";
import { commerce } from "@/features/commerce/lib";
import { ColorsScene } from "@/features/landing/scenes/ColorsScene";

export function Colors() {
  const product = commerce.getProduct();

  return (
    <ColorsScene
      title={homeContent.colors.title}
      body={homeContent.colors.body}
      product={product}
      shippingLabel={productPageContent.purchasePanel.shippingLabel}
      warrantyLabel={productPageContent.purchasePanel.warrantyLabel}
    />
  );
}
