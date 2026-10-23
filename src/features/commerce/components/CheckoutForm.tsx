"use client";

import { useEffect, useRef } from "react";
import { commerceContent } from "@/content/commerce";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { useCheckoutForm } from "@/features/commerce/hooks/useCheckoutForm";
import { Button } from "@/shared/components/ui/Button";
import { InputField } from "@/shared/components/ui/forms/InputField";
import { Link } from "@/shared/components/ui/Link";
import { useHydrated } from "@/shared/hooks/useHydrated";

const copy = commerceContent.checkout;

function panelId(stepId: string) {
  return `checkout-panel-${stepId}`;
}

function triggerId(stepId: string) {
  return `checkout-trigger-${stepId}`;
}

export function CheckoutForm() {
  const {
    register,
    errors,
    isSubmitting,
    onSubmit,
    step,
    goNext,
    goTo,
    values,
    cart,
  } = useCheckoutForm();
  const hydrated = useHydrated();
  const formRef = useRef<HTMLFormElement>(null);
  const shownStepRef = useRef(step);

  useEffect(() => {
    if (shownStepRef.current === step) {
      return;
    }

    shownStepRef.current = step;
    const stepId = copy.steps[step]?.id;

    if (!stepId) {
      return;
    }

    const target =
      formRef.current?.querySelector<HTMLElement>(
        `#${panelId(stepId)} input:not(:disabled)`,
      ) ?? document.getElementById(triggerId(stepId));
    target?.focus();
  }, [step]);

  if (!hydrated) {
    return (
      <p className="text-body text-ink-2">{commerceContent.cart.loading}</p>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-body text-ink-2">{commerceContent.cart.empty}</p>
        <Link href="/camara">{commerceContent.cart.emptyCta}</Link>
      </div>
    );
  }

  const current = values();

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
      {copy.steps.map((item, index) => {
        const open = step === index;

        return (
          <section key={item.id} className="border-b border-paper-2">
            <h2>
              <button
                type="button"
                id={triggerId(item.id)}
                aria-expanded={open}
                aria-controls={panelId(item.id)}
                className="flex w-full items-center py-4 text-left font-display text-h3 text-ink focus-visible:focus-ring"
                onClick={() => goTo(index)}
              >
                {index + 1}. {item.title}
              </button>
            </h2>

            <div
              id={panelId(item.id)}
              hidden={!open}
              className="space-y-4 pb-6"
            >
              {item.id === "contact" ? (
                <fieldset className="space-y-4">
                  <legend className="sr-only">{item.title}</legend>
                  <InputField
                    label={copy.fields.name}
                    autoComplete="name"
                    error={errors.name?.message}
                    {...register("name")}
                  />
                  <InputField
                    label={copy.fields.email}
                    type="email"
                    autoComplete="email"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  <InputField
                    label={copy.fields.phone}
                    type="tel"
                    autoComplete="tel"
                    error={errors.phone?.message}
                    {...register("phone")}
                  />
                </fieldset>
              ) : null}

              {item.id === "shipping" ? (
                <fieldset className="space-y-4">
                  <legend className="sr-only">{item.title}</legend>
                  <InputField
                    label={copy.fields.address}
                    autoComplete="street-address"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                  <InputField
                    label={copy.fields.city}
                    autoComplete="address-level2"
                    error={errors.city?.message}
                    {...register("city")}
                  />
                  <InputField
                    label={copy.fields.postal}
                    autoComplete="postal-code"
                    error={errors.postal?.message}
                    {...register("postal")}
                  />
                  <InputField
                    label={copy.fields.country}
                    autoComplete="country-name"
                    error={errors.country?.message}
                    {...register("country")}
                  />
                </fieldset>
              ) : null}

              {item.id === "payment" ? (
                <fieldset disabled className="space-y-4">
                  <legend className="sr-only">{item.title}</legend>
                  <p className="text-small text-ink-2">{copy.demoNote}</p>
                  <InputField
                    label={copy.fields.cardNumber}
                    value={copy.paymentPlaceholders.cardNumber}
                    readOnly
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InputField
                      label={copy.fields.cardExpiry}
                      value={copy.paymentPlaceholders.cardExpiry}
                      readOnly
                    />
                    <InputField
                      label={copy.fields.cardCvc}
                      value={copy.paymentPlaceholders.cardCvc}
                      readOnly
                    />
                  </div>
                </fieldset>
              ) : null}

              {item.id === "review" ? (
                <>
                  <dl className="space-y-2 text-body text-ink">
                    <div>
                      <dt className="font-mono-label text-ink-2">
                        {copy.review.contact}
                      </dt>
                      <dd>
                        {current.name} · {current.email} · {current.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-mono-label text-ink-2">
                        {copy.review.shipping}
                      </dt>
                      <dd>
                        {current.address}, {current.city}, {current.postal},{" "}
                        {current.country}
                      </dd>
                    </div>
                  </dl>
                  <CartSummary cart={cart} />
                </>
              ) : null}

              {index === copy.steps.length - 1 ? (
                <Button type="submit" loading={isSubmitting}>
                  {copy.simulatePayment}
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  {copy.continue}
                </Button>
              )}
            </div>
          </section>
        );
      })}

      {errors.root?.message ? (
        <p role="alert" className="text-body text-ink">
          {errors.root.message}
        </p>
      ) : null}
    </form>
  );
}
