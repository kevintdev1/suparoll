import type { Metadata } from "next";
import { getFaqByTag } from "@/content/faq";
import { product as productContent } from "@/content/product";
import { productPageContent } from "@/content/product-page";
import { site } from "@/content/site";
import { ProductHero } from "@/features/commerce/components/ProductHero";
import { commerce } from "@/features/commerce/lib";
import { RevealImage } from "@/shared/components/ui/RevealImage";
import { RevealText } from "@/shared/components/ui/RevealText";
import { getAsset, getAssetsByGroup } from "@/shared/lib/assets";

export const metadata: Metadata = {
  title: site.seo.camara.title,
  description: site.seo.camara.description,
};

export default function CamaraPage() {
  const product = commerce.getProduct();
  const images = productPageContent.galleryAssetIds.map((id) => getAsset(id));
  const faqItems = getFaqByTag("product");
  const samplePhotos = getAssetsByGroup("gallery").slice(0, 8);
  const specEntries = [
    { label: "Película", value: productContent.specs.filmType },
    { label: "Lente", value: productContent.specs.lens },
    { label: "Flash", value: productContent.specs.flash },
    { label: "Batería", value: productContent.specs.battery },
    { label: "Dimensiones", value: productContent.specs.dimensions },
    { label: "Peso", value: productContent.specs.weight },
  ];
  const boxItems =
    productContent.specs.inTheBox ?? productPageContent.inTheBox.items;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.model ?? product.brand,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
  };

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      <ProductHero
        product={product}
        images={images}
        shippingLabel={productPageContent.purchasePanel.shippingLabel}
        warrantyLabel={productPageContent.purchasePanel.warrantyLabel}
        quantityLabel={productPageContent.purchasePanel.quantityLabel}
      />

      <section
        id={productPageContent.inTheBox.id}
        aria-labelledby="in-the-box-title"
        className="bg-paper px-[clamp(16px,3vw,40px)] py-24"
      >
        <div className="mx-auto max-w-3xl">
          <RevealText
            as="h2"
            id="in-the-box-title"
            className="font-display text-h2 text-ink"
          >
            {productPageContent.inTheBox.title}
          </RevealText>
          <p className="mt-4 text-body text-ink-2">
            {productPageContent.inTheBox.subtitle}
          </p>
          <ul className="mt-8 space-y-3 text-body text-ink">
            {boxItems ? (
              boxItems.map((item) => <li key={item}>{item}</li>)
            ) : (
              <li>[[PENDIENTE: contenido de la caja]]</li>
            )}
          </ul>
        </div>
      </section>

      <section
        id={productPageContent.specs.id}
        aria-labelledby="product-specs-title"
        className="bg-paper px-[clamp(16px,3vw,40px)] py-24"
      >
        <div className="mx-auto max-w-5xl">
          <RevealText
            as="h2"
            id="product-specs-title"
            className="font-display text-h2 text-ink"
          >
            {productPageContent.specs.title}
          </RevealText>
          <p className="mt-4 text-body text-ink-2">
            {productPageContent.specs.subtitle}
          </p>
          <dl className="mt-12 grid gap-6 sm:grid-cols-2">
            {specEntries.map(({ label, value }) => (
              <div key={label} className="border-t border-paper-2 pt-4">
                <dt className="font-mono text-label uppercase tracking-wider text-ink-2">
                  {label}
                </dt>
                <dd className="mt-2 text-body text-ink">
                  {value ?? "[[PENDIENTE]]"}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id={productPageContent.samplePhotos.id}
        aria-labelledby="sample-photos-title"
        className="bg-paper px-[clamp(16px,3vw,40px)] py-24"
      >
        <div className="mx-auto max-w-[1600px]">
          <RevealText
            as="h2"
            id="sample-photos-title"
            className="font-display text-h2 text-ink"
          >
            {productPageContent.samplePhotos.title}
          </RevealText>
          <p className="mt-4 max-w-xl text-body text-ink-2">
            {productPageContent.samplePhotos.description}
          </p>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {samplePhotos.map((photo) => (
              <RevealImage
                key={photo.id}
                src={photo.src}
                alt={photo.alt || "Foto tomada con Suparoll"}
                width={photo.width}
                height={photo.height}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id={productPageContent.faq.id}
        aria-labelledby="product-faq-title"
        className="bg-paper px-[clamp(16px,3vw,40px)] py-24"
      >
        <div className="mx-auto max-w-3xl">
          <RevealText
            as="h2"
            id="product-faq-title"
            className="font-display text-h2 text-ink"
          >
            {productPageContent.faq.title}
          </RevealText>
          <dl className="mt-12 divide-y divide-paper-2">
            {faqItems.map((item) => (
              <div key={item.id} className="py-6">
                <dt className="font-display text-h3 text-ink">
                  {item.question}
                </dt>
                <dd className="mt-3 text-body text-ink-2">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {productContent.accessories.length > 0 ? (
        <section
          id={productPageContent.related.id}
          aria-labelledby="related-title"
          className="bg-paper px-[clamp(16px,3vw,40px)] py-24"
        >
          <div className="mx-auto max-w-3xl">
            <h2 id="related-title" className="font-display text-h2 text-ink">
              {productPageContent.related.title}
            </h2>
          </div>
        </section>
      ) : null}
    </>
  );
}
