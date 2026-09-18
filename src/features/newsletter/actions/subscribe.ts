"use server";

import { subscribeSchema } from "@/features/newsletter/schemas/subscribe.schema";
import type { ActionResult } from "@/features/newsletter/types";

export async function subscribe(input: unknown): Promise<ActionResult> {
  const parsed = subscribeSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: "Revisa los datos del formulario." };
  }

  // Modo demostración — sin servicio real conectado (ver docs/pendientes.md copy-013)
  await new Promise((resolve) => setTimeout(resolve, 600));

  return { ok: true };
}
