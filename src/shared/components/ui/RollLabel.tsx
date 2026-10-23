import type { ReactNode } from "react";

const ROLL =
  "transition-transform duration-300 ease-out group-hover:-translate-y-full group-focus-visible:-translate-y-full motion-reduce:transition-none";

export function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="relative block h-[1.5em] overflow-hidden">
      <span className={`block ${ROLL}`}>{children}</span>
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-full ${ROLL}`}
      >
        {children}
      </span>
    </span>
  );
}
