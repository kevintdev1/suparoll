"use client";

import { type InputHTMLAttributes, type Ref, useId } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  labelClassName?: string;
  ref?: Ref<HTMLInputElement>;
};

export function InputField({
  label,
  error,
  id,
  ref,
  className = "",
  labelClassName = "",
  ...props
}: InputFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div
      data-invalid={error ? true : undefined}
      className="flex flex-col gap-2"
    >
      <label
        htmlFor={inputId}
        className={`font-mono text-label uppercase tracking-wider text-ink-2 ${labelClassName}`}
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 rounded-[8px] border border-paper-2 bg-paper px-4 text-body text-ink outline-none focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
        {...props}
      />
      {error ? (
        <p id={errorId} role="alert" className="text-small text-shutter">
          {error}
        </p>
      ) : null}
    </div>
  );
}
