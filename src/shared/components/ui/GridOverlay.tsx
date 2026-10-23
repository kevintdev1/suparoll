"use client";

import { useEffect, useState } from "react";

export function GridOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "g" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        setVisible((current) => !current);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-100 page-margin"
    >
      <div className="content-max grid h-full grid-cols-4 gap-(--gutter) sm:grid-cols-8 md:grid-cols-12">
        {(
          [
            "col-1",
            "col-2",
            "col-3",
            "col-4",
            "col-5",
            "col-6",
            "col-7",
            "col-8",
            "col-9",
            "col-10",
            "col-11",
            "col-12",
          ] as const
        ).map((colId, index) => (
          <div
            key={colId}
            className={`bg-shutter/10 ${index >= 8 ? "hidden md:block" : index >= 4 ? "hidden sm:block" : ""}`}
          />
        ))}
      </div>
    </div>
  );
}
