"use client";

import { useEffect, useRef, useState } from "react";

type MainWrapperProps = {
  children: React.ReactNode;
};

export function MainWrapper({ children }: MainWrapperProps) {
  const mainRef = useRef<HTMLElement>(null);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const footer = document.querySelector("footer");

    if (!footer) {
      return;
    }

    const updateHeight = () => {
      setFooterHeight(footer.offsetHeight);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(footer);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className="relative z-[1] bg-paper"
      style={{ marginBottom: footerHeight }}
    >
      {children}
    </main>
  );
}
