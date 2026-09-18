"use client";

import { type Ref, type SelectHTMLAttributes, useId } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: SelectOption[];
  ref?: Ref<HTMLSelectElement>;
};

export function SelectField({
  label,
  error,
  id,
  ref,
  options,
  className = "",
  ...props
}: SelectFieldProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;

  return (
    <div
      data-invalid={error ? true : undefined}
      className="flex flex-col gap-2"
    >
      <label
        htmlFor={selectId}
        className="font-mono text-label uppercase tracking-wider text-ink-2"
      >
        {label}
      </label>
      <select
        ref={ref}
        id={selectId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 rounded-[8px] border border-paper-2 bg-paper px-4 text-body text-ink outline-none focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={errorId} role="alert" className="text-small text-shutter">
          {error}
        </p>
      ) : null}
    </div>
  );
}
