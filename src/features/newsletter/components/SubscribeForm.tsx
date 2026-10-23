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
      className="mt-6 flex max-w-md flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end"
      data-native-cursor
    >
      <div className="flex-1">
        <InputField
          label={microcopy.newsletterLabel}
          tone="inverse"
          type="email"
          autoComplete="email"
          placeholder={microcopy.newsletterPlaceholder}
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        tone="inverse"
        loading={isSubmitting}
        disabled={submitted}
      >
        {microcopy.newsletterSubmit}
      </Button>
      <output className="text-small text-paper sm:basis-full">
        {submitted ? microcopy.newsletterSuccess : null}
      </output>
      {errors.root ? (
        <p role="alert" className="text-small text-paper sm:basis-full">
          {errors.root.message}
        </p>
      ) : null}
    </form>
  );
}
