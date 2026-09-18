import { site } from "@/content/site";

const PAGE_LABELS: Record<string, string> = {
  "/": "Inicio",
  "/camara": "Cámara",
  "/carrito": "Carrito",
  "/checkout": "Checkout",
  "/checkout/confirmacion": "Confirmación",
  "/soporte": "Soporte",
  "/legal/privacidad": "Privacidad",
  "/legal/terminos": "Términos",
};

const SEO_PATHS: Record<string, keyof typeof site.seo> = {
  "/": "home",
  "/camara": "camara",
  "/carrito": "carrito",
  "/checkout": "checkout",
  "/checkout/confirmacion": "confirmacion",
  "/soporte": "soporte",
  "/legal/privacidad": "privacidad",
  "/legal/terminos": "terminos",
};

export function normalizePath(href: string): string {
  const [path] = href.split(/[?#]/);
  return path || "/";
}

export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function getPageLabel(href: string): string {
  const path = normalizePath(href);

  if (PAGE_LABELS[path]) {
    return PAGE_LABELS[path];
  }

  const seoKey = SEO_PATHS[path];

  if (seoKey) {
    return site.seo[seoKey].title.split("—")[0]?.trim() ?? path;
  }

  return path;
}
