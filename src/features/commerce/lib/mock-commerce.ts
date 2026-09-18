import { product } from "@/content/product";
import { productPageContent } from "@/content/product-page";
import { site } from "@/content/site";
import { getDebugCartError, getDebugSoldOut } from "@/shared/lib/motion/debug";
import type { CheckoutValues } from "../schemas/checkout.schema";
import type {
  Cart,
  CartLine,
  CommerceProduct,
  CommerceProvider,
  SimulatedOrder,
} from "../types";
import { CommerceError } from "../types";
import { sumLinePrices } from "./format-price";
import { loadCart, saveCart, saveOrder } from "./storage";

const PRODUCT_ID = "suparoll-camera";
const SHIPPING_LABEL = productPageContent.purchasePanel.shippingLabel;

export const emptyCart: Cart = {
  lines: [],
  itemCount: 0,
  subtotal: null,
  shippingStatus: "pending",
  shippingLabel: SHIPPING_LABEL,
  total: null,
};

const listeners = new Set<() => void>();
let snapshot: Cart = emptyCart;
let didHydrate = false;

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

function hydrateCart(): void {
  if (didHydrate || typeof window === "undefined") {
    return;
  }

  didHydrate = true;
  snapshot = loadCart() ?? emptyCart;
}

export function subscribeCart(listener: () => void): () => void {
  listeners.add(listener);

  if (typeof window !== "undefined" && !didHydrate) {
    queueMicrotask(() => {
      if (didHydrate) {
        return;
      }

      hydrateCart();
      notify();
    });
  }

  return () => {
    listeners.delete(listener);
  };
}

export function getCartSnapshot(): Cart {
  return snapshot;
}

export function getServerCartSnapshot(): Cart {
  return emptyCart;
}

function summarize(lines: CartLine[]): Cart {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = sumLinePrices(
    lines.map((line) =>
      line.unitPrice == null ? null : line.unitPrice * line.quantity,
    ),
  );

  return {
    lines,
    itemCount,
    subtotal,
    shippingStatus: "pending",
    shippingLabel: SHIPPING_LABEL,
    total: subtotal,
  };
}

function persist(cart: Cart): Cart {
  snapshot = cart;
  saveCart(cart);
  notify();
  return cart;
}

function assertWritable(): void {
  if (getDebugCartError()) {
    throw new CommerceError(site.microcopy.paymentError);
  }
}

function getProduct(): CommerceProduct {
  return {
    id: PRODUCT_ID,
    brand: product.brand,
    model: product.model,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currency: product.currency,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      colorHex: variant.colorHex,
      imageAssetId: variant.imageAssetId,
      available: !getDebugSoldOut(),
    })),
  };
}

function getCart(): Cart {
  hydrateCart();
  return snapshot;
}

function addToCart(variantId: string, quantity = 1): Cart {
  assertWritable();

  const catalog = getProduct();
  const variant = catalog.variants.find((item) => item.id === variantId);

  if (!variant) {
    throw new CommerceError("Esa variante no está disponible.");
  }

  if (!variant.available) {
    throw new CommerceError(site.microcopy.outOfStock);
  }

  const safeQuantity = Math.max(1, Math.floor(quantity));
  const cart = getCart();
  const lineId = `${catalog.id}:${variant.id}`;
  const existing = cart.lines.find((line) => line.id === lineId);

  const nextLines = existing
    ? cart.lines.map((line) =>
        line.id === lineId
          ? { ...line, quantity: line.quantity + safeQuantity }
          : line,
      )
    : [
        ...cart.lines,
        {
          id: lineId,
          productId: catalog.id,
          variantId: variant.id,
          name: catalog.model ?? catalog.brand,
          variantName: variant.name,
          quantity: safeQuantity,
          unitPrice: catalog.price,
          currency: catalog.currency,
          imageAssetId: variant.imageAssetId,
          colorHex: variant.colorHex,
        },
      ];

  return persist(summarize(nextLines));
}

function updateLine(lineId: string, quantity: number): Cart {
  assertWritable();

  const nextQuantity = Math.floor(quantity);
  const cart = getCart();

  const nextLines =
    nextQuantity <= 0
      ? cart.lines.filter((line) => line.id !== lineId)
      : cart.lines.map((line) =>
          line.id === lineId ? { ...line, quantity: nextQuantity } : line,
        );

  return persist(summarize(nextLines));
}

function removeLine(lineId: string): Cart {
  return updateLine(lineId, 0);
}

function createOrderId(): string {
  const nibble = Math.floor(1000 + Math.random() * 9000);
  return `SR-${nibble}`;
}

function checkout(input: CheckoutValues): SimulatedOrder {
  assertWritable();

  const cart = getCart();

  if (cart.lines.length === 0) {
    throw new CommerceError(site.microcopy.emptyCart);
  }

  const order: SimulatedOrder = {
    orderId: createOrderId(),
    lines: cart.lines,
    subtotal: cart.subtotal,
    shippingLabel: cart.shippingLabel,
    currency: cart.lines[0]?.currency ?? null,
    contactName: input.name,
  };

  saveOrder(order);
  persist({
    ...emptyCart,
    lines: [],
  });

  return order;
}

export const commerce: CommerceProvider = {
  getProduct,
  getCart,
  addToCart,
  updateLine,
  removeLine,
  checkout,
};
