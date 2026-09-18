"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { site } from "@/content/site";
import { checkoutAction } from "@/features/commerce/actions/checkout";
import { useCart } from "@/features/commerce/hooks/useCart";
import {
  CHECKOUT_DEFAULTS,
  type CheckoutValues,
  CONTACT_FIELDS,
  checkoutSchema,
  SHIPPING_FIELDS,
} from "@/features/commerce/schemas/checkout.schema";
import { CommerceError } from "@/features/commerce/types";

export type CheckoutStep = 0 | 1 | 2 | 3;

const STEP_FIELDS: Record<0 | 1, readonly (keyof CheckoutValues)[]> = {
  0: CONTACT_FIELDS,
  1: SHIPPING_FIELDS,
};

export function useCheckoutForm() {
  const router = useRouter();
  const { cart, checkout } = useCart();
  const [step, setStep] = useState<CheckoutStep>(0);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: CHECKOUT_DEFAULTS,
    mode: "onTouched",
    reValidateMode: "onBlur",
  });

  const { errors, isSubmitting } = form.formState;

  const focusFirstError = () => {
    const invalid = document.querySelector<HTMLElement>(
      "[aria-invalid='true']",
    );
    invalid?.focus();
  };

  const goNext = async () => {
    if (step === 0 || step === 1) {
      const valid = await form.trigger([...STEP_FIELDS[step]]);

      if (!valid) {
        focusFirstError();
        return;
      }
    }

    setStep((current) => Math.min(3, current + 1) as CheckoutStep);
  };

  const goTo = async (next: CheckoutStep) => {
    if (next > step && (step === 0 || step === 1)) {
      const valid = await form.trigger([...STEP_FIELDS[step]]);

      if (!valid) {
        focusFirstError();
        return;
      }
    }

    setStep(next);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const gate = await checkoutAction(values);

    if (!gate.ok) {
      form.setError("root", { message: gate.error });
      focusFirstError();
      return;
    }

    try {
      checkout(values);
      router.push("/checkout/confirmacion");
    } catch (caught) {
      const message =
        caught instanceof CommerceError
          ? caught.message
          : site.microcopy.paymentError;
      form.setError("root", { message });
      focusFirstError();
    }
  });

  return {
    register: form.register,
    errors,
    isSubmitting,
    onSubmit,
    step,
    goNext,
    goTo,
    values: form.getValues,
    cart,
  };
}
