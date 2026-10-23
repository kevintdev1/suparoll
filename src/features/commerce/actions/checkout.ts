"use server";

import { commerceContent } from "@/content/commerce";
import { checkoutSchema } from "@/features/commerce/schemas/checkout.schema";
import type { ActionResult } from "@/features/commerce/types";

export async function checkoutAction(input: unknown): Promise<ActionResult> {
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return { ok: false, error: commerceContent.checkout.formError };
  }

  return { ok: true };
}
