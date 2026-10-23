"use client";

import { useId } from "react";
import type { CommerceVariant } from "@/features/commerce/types";

type VariantPickerProps = {
  variants: CommerceVariant[];
  value: string;
  onChange: (id: string) => void;
  labelledBy?: string;
};

export function VariantPicker({
  variants,
  value,
  onChange,
  labelledBy,
}: VariantPickerProps) {
  const name = useId();

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      className="flex flex-wrap gap-3"
    >
      {variants.map((variant) => {
        const checked = variant.id === value;

        return (
          <label
            key={variant.id}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-pill border border-ink/40 px-3 text-ink has-checked:border-ink has-focus-visible:focus-ring"
          >
            <input
              type="radio"
              name={name}
              value={variant.id}
              checked={checked}
              onChange={() => onChange(variant.id)}
              className="sr-only"
            />
            <span
              className="size-5 rounded-full border border-ink/40"
              style={{ backgroundColor: variant.colorHex }}
              aria-hidden="true"
            />
            <span className="font-mono-label">{variant.name}</span>
          </label>
        );
      })}
    </div>
  );
}
