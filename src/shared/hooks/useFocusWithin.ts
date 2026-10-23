"use client";

import { type RefObject, useEffect, useState } from "react";

export function useFocusWithin(ref: RefObject<HTMLElement | null>): boolean {
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const onFocusIn = () => setFocused(true);
    const onFocusOut = (event: FocusEvent) => {
      if (!node.contains(event.relatedTarget as Node | null)) {
        setFocused(false);
      }
    };

    node.addEventListener("focusin", onFocusIn);
    node.addEventListener("focusout", onFocusOut);

    return () => {
      node.removeEventListener("focusin", onFocusIn);
      node.removeEventListener("focusout", onFocusOut);
    };
  }, [ref]);

  return focused;
}
