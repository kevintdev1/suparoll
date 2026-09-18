import { z } from "zod";

export const emailSchema = z
  .email("Escribe un correo válido")
  .max(254, "Este correo es demasiado largo");
