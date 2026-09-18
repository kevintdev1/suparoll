"use client";

import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { CartSummary } from "@/features/commerce/components/CartSummary";
import { useCheckoutForm } from "@/features/commerce/hooks/useCheckoutForm";
import { Button } from "@/shared/components/ui/Button";
import { InputField } from "@/shared/components/ui/forms/InputField";
import { Link } from "@/shared/components/ui/Link";

const STEPS = [
  { id: "contact", title: "Contacto" },
  { id: "shipping", title: "Envío" },
  { id: "payment", title: "Pago" },
  { id: "review", title: "Revisión" },
] as const;

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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <p className="text-body text-ink-2">{site.microcopy.loadingCart}</p>;
  }

  if (cart.lines.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-body text-ink-2">{site.microcopy.emptyCart}</p>
        <Link href="/camara">{site.microcopy.emptyCartCta}</Link>
      </div>
    );
  }

  const currentValues = values();

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {STEPS.map((item, index) => {
        const open = step === index;
        const panelId = `checkout-panel-${item.id}`;
        const buttonId = `checkout-trigger-${item.id}`;

        return (
          <section key={item.id} className="border-b border-paper-2">
            <h2>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                className="flex w-full items-center justify-between py-4 text-left focus-visible:focus-ring"
                onClick={() => goTo(index as 0 | 1 | 2 | 3)}
              >
                <span className="font-display text-h3 text-ink">
                  {index + 1}. {item.title}
                </span>
                <span className="font-mono text-label uppercase tracking-wider text-ink-2">
                  {open ? "Abierta" : "Cerrada"}
                </span>
              </button>
            </h2>

            <div id={panelId} hidden={!open}>
              <div className="space-y-4 pb-6">
                {index === 0 ? (
                  <>
                    <InputField
                      label="Nombre"
                      autoComplete="name"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <InputField
                      label="Correo"
                      type="email"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                    <InputField
                      label="Teléfono"
                      type="tel"
                      autoComplete="tel"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </>
                ) : null}

                {index === 1 ? (
                  <>
                    <InputField
                      label="Dirección"
                      autoComplete="street-address"
                      error={errors.address?.message}
                      {...register("address")}
                    />
                    <InputField
                      label="Ciudad"
                      autoComplete="address-level2"
                      error={errors.city?.message}
                      {...register("city")}
                    />
                    <InputField
                      label="Código postal"
                      autoComplete="postal-code"
                      error={errors.postal?.message}
                      {...register("postal")}
                    />
                    <InputField
                      label="País"
                      autoComplete="country-name"
                      error={errors.country?.message}
                      {...register("country")}
                    />
                  </>
                ) : null}

                {index === 2 ? (
                  <>
                    <p className="text-small text-ink-2">
                      {site.microcopy.checkoutDemoNote}
                    </p>
                    <InputField
                      label="Número de tarjeta"
                      disabled
                      value="•••• •••• •••• ••••"
                      readOnly
                    />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <InputField
                        label="Caducidad"
                        disabled
                        value="MM/AA"
                        readOnly
                      />
                      <InputField label="CVC" disabled value="•••" readOnly />
                    </div>
                  </>
                ) : null}

                {index === 3 ? (
                  <>
                    <dl className="space-y-2 text-body text-ink">
                      <div>
                        <dt className="font-mono text-label uppercase tracking-wider text-ink-2">
                          Contacto
                        </dt>
                        <dd>
                          {currentValues.name} · {currentValues.email} ·{" "}
                          {currentValues.phone}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-label uppercase tracking-wider text-ink-2">
                          Envío
                        </dt>
                        <dd>
                          {currentValues.address}, {currentValues.city},{" "}
                          {currentValues.postal}, {currentValues.country}
                        </dd>
                      </div>
                    </dl>
                    <CartSummary cart={cart} />
                  </>
                ) : null}

                {index < 3 ? (
                  <Button type="button" onClick={goNext}>
                    Continuar
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {site.microcopy.simulatePayment}
                  </Button>
                )}
              </div>
            </div>
          </section>
        );
      })}

      {errors.root?.message ? (
        <p role="alert" className="text-body text-shutter">
          {errors.root.message}
        </p>
      ) : null}
    </form>
  );
}
