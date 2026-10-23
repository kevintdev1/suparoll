export const MAIN_CONTENT_ID = "contenido";

export type PageLabels = Record<string, string>;

export function normalizePath(href: string): string {
  const [path] = href.split(/[?#]/);
  return path || "/";
}

export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function resolvePageLabel(labels: PageLabels, href: string): string {
  const path = normalizePath(href);
  return labels[path] ?? path;
}
