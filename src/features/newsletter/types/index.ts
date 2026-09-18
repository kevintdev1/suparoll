import type { z } from "zod";
import type { subscribeSchema } from "@/features/newsletter/schemas/subscribe.schema";

export type SubscribeValues = z.infer<typeof subscribeSchema>;

export type ActionResult = { ok: true } | { ok: false; error: string };
