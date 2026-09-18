import { z } from "zod";

export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Escribe un teléfono válido")
  .max(20, "Este teléfono es demasiado largo")
  .regex(/^[0-9+\s()-]+$/, "Usa solo números y símbolos de teléfono");
