import { formatPrice } from "@/features/commerce/lib";

type PriceTagProps = {
  price: number | null;
  currency: string | null;
  className?: string;
};

export function PriceTag({ price, currency, className = "" }: PriceTagProps) {
  return (
    <p
      className={`font-mono text-label uppercase tracking-wider text-ink ${className}`}
    >
      {formatPrice(price, currency)}
    </p>
  );
}
