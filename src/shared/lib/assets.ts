import { z } from "zod";
import assetsManifest from "@/content/assets.json";
import heroFramesManifest from "../../../public/media/hero/frames/manifest.json";
import heroZoomManifest from "../../../public/media/hero/frames-zoom/manifest.json";

const assetStatusSchema = z.enum([
  "pendiente",
  "placeholder",
  "listo",
  "revisar",
]);

const imageSlotSchema = z.object({
  id: z.string(),
  group: z.string(),
  section: z.string(),
  alt: z.string(),
  status: assetStatusSchema,
  origin: z.string(),
  license: z.string(),
  output: z.string(),
  width: z.number(),
  height: z.number(),
  blurDataURL: z.string().optional(),
});

const sequenceSlotSchema = z.object({
  id: z.string(),
  type: z.literal("sequence"),
  group: z.string(),
  section: z.string(),
  alt: z.string(),
  status: assetStatusSchema,
  manifest: z.string(),
});

const sequenceVariantSchema = z.object({
  path: z.string(),
  pattern: z.string(),
  count: z.number().int().positive(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

const sequenceManifestSchema = z.object({
  background: z.string(),
  desktop: sequenceVariantSchema,
  mobile: sequenceVariantSchema,
});

const assetsFileSchema = z.object({
  slots: z.array(z.union([sequenceSlotSchema, imageSlotSchema])),
});

export type AssetStatus = z.infer<typeof assetStatusSchema>;
export type SequenceVariant = z.infer<typeof sequenceVariantSchema>;

export type Asset = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  blurDataURL?: string;
  isPlaceholder: boolean;
  status: AssetStatus;
};

export type Sequence = {
  id: string;
  alt: string;
  background: string;
  desktop: SequenceVariant;
  mobile: SequenceVariant;
};

const slotsById = new Map(
  assetsFileSchema.parse(assetsManifest).slots.map((slot) => [slot.id, slot]),
);

// El `manifest` del slot es una ruta en texto: los bundlers no pueden analizarla,
// así que las secuencias se registran aquí de forma explícita.
const sequenceManifestsById = new Map([
  ["hero-sequence", sequenceManifestSchema.parse(heroFramesManifest)],
  ["hero-sequence-zoom", sequenceManifestSchema.parse(heroZoomManifest)],
]);

export function getAsset(id: string): Asset {
  const slot = slotsById.get(id);

  if (!slot) {
    throw new Error(
      `Asset "${id}" no existe en src/content/assets.json. Registra el hueco antes de usarlo.`,
    );
  }

  if ("type" in slot) {
    throw new Error(
      `Asset "${id}" es una secuencia. Úsala con getSequence("${id}").`,
    );
  }

  const isPlaceholder =
    slot.status === "placeholder" || slot.origin === "placeholder";

  return {
    id: slot.id,
    src: slot.output,
    width: slot.width,
    height: slot.height,
    alt: slot.alt,
    blurDataURL: slot.blurDataURL,
    isPlaceholder,
    status: slot.status,
  };
}

export function getSequence(id: string): Sequence {
  const slot = slotsById.get(id);

  if (!slot) {
    throw new Error(
      `Secuencia "${id}" no existe en src/content/assets.json. Registra el hueco antes de usarla.`,
    );
  }

  if (!("type" in slot)) {
    throw new Error(
      `Asset "${id}" es una imagen suelta. Úsala con getAsset("${id}").`,
    );
  }

  const manifest = sequenceManifestsById.get(id);

  if (!manifest) {
    throw new Error(
      `Secuencia "${id}" no tiene manifest registrado en src/shared/lib/assets.ts.`,
    );
  }

  return {
    id: slot.id,
    alt: slot.alt,
    background: manifest.background,
    desktop: manifest.desktop,
    mobile: manifest.mobile,
  };
}
