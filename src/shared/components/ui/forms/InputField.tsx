import { type InputHTMLAttributes, type Ref, useId } from "react";

export type FieldTone = "ink" | "inverse";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  tone?: FieldTone;
  ref?: Ref<HTMLInputElement>;
};

const TONES: Record<
  FieldTone,
  { label: string; control: string; error: string }
> = {
  ink: {
    label: "text-ink-2",
    control: "border-ink/40 bg-paper text-ink placeholder:text-ink-2",
    error: "text-ink",
  },
  inverse: {
    label: "text-paper/70",
    control: "border-paper/40 bg-ink text-paper placeholder:text-paper/70",
    error: "text-paper",
  },
};

export function InputField({
  label,
  error,
  tone = "ink",
  id,
  ref,
  className = "",
  ...props
}: InputFieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const styles = TONES[tone];

  return (
    <div
      data-invalid={error ? true : undefined}
      className="flex flex-col gap-2"
    >
      <label htmlFor={inputId} className={`font-mono-label ${styles.label}`}>
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 rounded-input border px-4 text-body focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-shutter ${styles.control} ${className}`}
        {...props}
      />
      {error ? (
        <p
          id={errorId}
          className={`flex items-center gap-2 text-small ${styles.error}`}
        >
          <span
            aria-hidden="true"
            className="size-2 shrink-0 rounded-full bg-shutter"
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}
