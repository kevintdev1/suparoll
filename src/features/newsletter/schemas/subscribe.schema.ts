import { z } from "zod";
import { emailSchema } from "@/shared/validations/email";

export const subscribeSchema = z.object({
  email: emailSchema,
});
