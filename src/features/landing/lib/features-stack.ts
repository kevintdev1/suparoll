const TOP_BASE = 80;
const CARD_OFFSET = 48;
const SCALE_STEP = 0.04;

export const FEATURE_SCRIM_OPACITY = 0.3;

export function featureCardTop(index: number): number {
  return TOP_BASE + index * CARD_OFFSET;
}

export function featureCardScale(index: number, total: number): number {
  return 1 - SCALE_STEP * (total - index - 1);
}
