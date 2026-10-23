export const MEDIA_DESKTOP = "(min-width: 1024px)";

export const MEDIA_FINE_POINTER = "(hover: hover) and (pointer: fine)";

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const MOTION_DESKTOP = `${MEDIA_DESKTOP} and ${MOTION_OK}`;

export const MOTION_MOBILE = `(max-width: 1023px) and ${MOTION_OK}`;

export const MOTION_REDUCED = "(prefers-reduced-motion: reduce)";
