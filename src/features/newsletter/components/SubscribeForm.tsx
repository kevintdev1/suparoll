"use client";

import { site } from "@/content/site";
import { useSubscribeForm } from "@/features/newsletter/hooks/useSubscribeForm";
import { Button } from "@/shared/components/ui/Button";
import { InputField } from "@/shared/components/ui/forms/InputField";

export function SubscribeForm() {
  const { register, errors, isSubmitting, submitted, onSubmit } =
    useSubscribeForm();
  const { microcopy } = site;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mt-6 flex max-w-md flex-col gap-4 sm:flex-row sm:items-end"
      data-native-cursor
    >
      <div className="flex-1">
        <InputField
          label="Correo electrónico"
          labelClassName="text-paper/50"
          type="email"
          autoComplete="email"
          placeholder={microcopy.newsletterPlaceholder}
          error={errors.email?.message}
          className="border-paper/20 bg-ink text-paper placeholder:text-paper/40"
          {...register("email")}
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        loading={isSubmitting}
        disabled={submitted}
        className="border-paper/30 bg-transparent text-paper hover:bg-paper hover:text-ink"
      >
        {submitted ? microcopy.newsletterSuccess : microcopy.newsletterSubmit}
      </Button>
      {errors.root ? (
        <p role="alert" className="text-small text-shutter sm:basis-full">
          {errors.root.message}
        </p>
      ) : null}
    </form>
  );
}
