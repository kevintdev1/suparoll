export type ButtonVariant = "primary" | "secondary";

export type ButtonTone = "ink" | "inverse";

const BASE =
  "relative inline-flex h-12 items-center justify-center overflow-hidden rounded-pill px-8 text-small font-medium transition-transform duration-200 active:scale-[0.97] focus-visible:focus-ring";

const PRIMARY_FILL =
  "group before:absolute before:inset-0 before:bg-shutter before:transition-[clip-path] before:duration-300 before:ease-out before:[clip-path:inset(100%_0_0_0)] hover:before:[clip-path:inset(0_0_0_0)] focus-visible:before:[clip-path:inset(0_0_0_0)]";

const VARIANTS: Record<ButtonVariant, Record<ButtonTone, string>> = {
  primary: {
    ink: `${PRIMARY_FILL} bg-ink text-paper`,
    inverse: `${PRIMARY_FILL} bg-paper text-ink`,
  },
  secondary: {
    ink: "border border-ink text-ink transition-colors duration-300 hover:bg-ink hover:text-paper",
    inverse:
      "border border-paper/60 text-paper transition-colors duration-300 hover:bg-paper hover:text-ink",
  },
};

export function buttonClassName(
  variant: ButtonVariant,
  tone: ButtonTone,
  className = "",
): string {
  return `${BASE} ${VARIANTS[variant][tone]} ${className}`;
}
