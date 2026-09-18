"use client";

import { Plus } from "lucide-react";
import { type KeyboardEvent, useId, useState } from "react";

export type AccordionItem = {
  id: string;
  question: string;
  answer: string;
};

type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  className?: string;
};

export function Accordion({
  items,
  allowMultiple = false,
  className = "",
}: AccordionProps) {
  const baseId = useId();
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((current) => {
      if (current.includes(id)) {
        return current.filter((itemId) => itemId !== id);
      }

      if (allowMultiple) {
        return [...current, id];
      }

      return [id];
    });
  };

  const onHeaderKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const nextIndex =
      event.key === "ArrowDown"
        ? (index + 1) % items.length
        : (index - 1 + items.length) % items.length;
    const nextId = `${baseId}-header-${items[nextIndex]?.id}`;
    document.getElementById(nextId)?.focus();
  };

  return (
    <div className={`divide-y divide-paper-2 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openIds.includes(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div key={item.id} className="py-2">
            <h3>
              <button
                id={headerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                onKeyDown={(event) => onHeaderKeyDown(event, index)}
                className="flex w-full items-center justify-between gap-4 py-4 text-left focus-visible:focus-ring"
              >
                <span className="font-display text-h3 text-ink">
                  {item.question}
                </span>
                <Plus
                  aria-hidden="true"
                  className={`size-5 shrink-0 text-ink transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
                />
              </button>
            </h3>
            <section
              id={panelId}
              aria-labelledby={headerId}
              aria-hidden={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <p className="pb-4 text-body text-ink-2">{item.answer}</p>
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
