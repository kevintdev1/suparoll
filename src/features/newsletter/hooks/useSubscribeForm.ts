"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { subscribe } from "@/features/newsletter/actions/subscribe";
import { subscribeSchema } from "@/features/newsletter/schemas/subscribe.schema";
import type { SubscribeValues } from "@/features/newsletter/types";

export function useSubscribeForm() {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<SubscribeValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
    reValidateMode: "onBlur",
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await subscribe(values);

    if (!result.ok) {
      form.setError("root", { message: result.error });
      return;
    }

    setSubmitted(true);
    form.reset({ email: "" });
  });

  return {
    register: form.register,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    submitted,
    onSubmit,
  };
}
