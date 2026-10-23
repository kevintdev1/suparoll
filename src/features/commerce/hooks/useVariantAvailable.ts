"use client";

import { useSyncExternalStore } from "react";
import { isDebugSoldOut } from "@/features/commerce/lib";
import type { CommerceVariant } from "@/features/commerce/types";

const subscribe = () => () => {};

export function useVariantAvailable(variant: CommerceVariant): boolean {
  const soldOut = useSyncExternalStore(subscribe, isDebugSoldOut, () => false);
  return variant.available && !soldOut;
}
