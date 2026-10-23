"use client";

import { Minus, Plus } from "lucide-react";
import { commerceContent } from "@/content/commerce";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  itemName: string;
  min?: number;
  showLabel?: boolean;
};

const STEP_BUTTON =
  "inline-flex size-11 items-center justify-center rounded-pill border border-ink/40 text-ink focus-visible:focus-ring disabled:opacity-40";

export function QuantityStepper({
  value,
  onChange,
  itemName,
  min = 1,
  showLabel = true,
}: QuantityStepperProps) {
  const { quantity } = commerceContent;

  return (
    <fieldset>
      <legend
        className={showLabel ? "mb-3 font-mono-label text-ink-2" : "sr-only"}
      >
        {quantity.label}
        <span className="sr-only">: {itemName}</span>
      </legend>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={STEP_BUTTON}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          aria-label={`${quantity.decrease}: ${itemName}`}
        >
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <span
          aria-live="polite"
          className="min-w-8 text-center font-mono-label text-ink"
        >
          {value}
        </span>
        <button
          type="button"
          className={STEP_BUTTON}
          onClick={() => onChange(value + 1)}
          aria-label={`${quantity.increase}: ${itemName}`}
        >
          <Plus aria-hidden="true" className="size-4" />
        </button>
      </div>
    </fieldset>
  );
}
