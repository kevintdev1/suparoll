import { z } from "zod";
import { emailSchema } from "@/shared/validations/email";
import { phoneSchema } from "@/shared/validations/phone";

const requiredText = (message: string, max = 120) =>
  z.string().trim().min(1, message).max(max, "Este texto es demasiado largo");

export const contactSchema = z.object({
  name: requiredText("Escribe tu nombre"),
  email: emailSchema,
  phone: phoneSchema,
});

export const shippingSchema = z.object({
  address: requiredText("Escribe tu dirección", 200),
  city: requiredText("Escribe tu ciudad"),
  postal: requiredText("Escribe el código postal", 20),
  country: requiredText("Escribe tu país"),
});

export const checkoutSchema = contactSchema.extend(shippingSchema.shape);

export type ContactValues = z.infer<typeof contactSchema>;
export type ShippingValues = z.infer<typeof shippingSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;

export const CHECKOUT_DEFAULTS: CheckoutValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postal: "",
  country: "",
};

export const CONTACT_FIELDS = ["name", "email", "phone"] as const;
export const SHIPPING_FIELDS = [
  "address",
  "city",
  "postal",
  "country",
] as const;
