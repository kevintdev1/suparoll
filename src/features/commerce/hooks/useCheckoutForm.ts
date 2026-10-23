"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { commerceContent } from "@/content/commerce";
import { checkoutAction } from "@/features/commerce/actions/checkout";
import { useCart } from "@/features/commerce/hooks/useCart";
import {
  CHECKOUT_DEFAULTS,
  CHECKOUT_STEP_FIELDS,
  type CheckoutValues,
  checkoutSchema,
} from "@/features/commerce/schemas/checkout.schema";
import { CommerceError } from "@/features/commerce/types";

const LAST_STEP = CHECKOUT_STEP_FIELDS.length - 1;

function focusFirstError() {
  document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
}

export function useCheckoutForm() {
  const router = useRouter();
  const { cart, checkout } = useCart();
  const [step, setStep] = useState(0);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: CHECKOUT_DEFAULTS,
    mode: "onTouched",
    reValidateMode: "onBlur",
  });

  const validateStep = async (index: number) => {
    const fields = CHECKOUT_STEP_FIELDS[index] ?? [];

    if (fields.length === 0) {
      return true;
    }

    const valid = await form.trigger([...fields]);

    if (!valid) {
      focusFirstError();
    }

    return valid;
  };

  const goTo = async (next: number) => {
    const target = Math.min(LAST_STEP, Math.max(0, next));

    if (target > step && !(await validateStep(step))) {
      return;
    }

    setStep(target);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const gate = await checkoutAction(values);

    if (!gate.ok) {
      form.setError("root", { message: gate.error });
      return;
    }

    try {
      checkout(values);
      router.push("/checkout/confirmacion");
    } catch (caught) {
      form.setError("root", {
        message:
          caught instanceof CommerceError
            ? caught.message
            : commerceContent.checkout.paymentError,
      });
    }
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    onSubmit,
    step,
    goTo,
    goNext: () => goTo(step + 1),
    values: form.getValues,
    cart,
  };
}
