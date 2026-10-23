"use client";

import { useEffect, useState } from "react";

export type SectionTheme = "light" | "dark";

function isTheme(value: string | null): value is SectionTheme {
  return value === "light" || value === "dark";
}

export function useSectionTheme(): SectionTheme {
  const [theme, setTheme] = useState<SectionTheme>("light");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(
      `[data-theme]:not(html)`,
    );

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const next = visible?.target.getAttribute("data-theme") ?? null;

        if (isTheme(next)) {
          setTheme(next);
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.25, 0.5] },
    );

    for (const section of sections) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return theme;
}
