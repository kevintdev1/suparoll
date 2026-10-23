"use client";

import { useEffect, useState } from "react";

export function useElementInView(elementId: string): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = document.getElementById(elementId);

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId]);

  return inView;
}
