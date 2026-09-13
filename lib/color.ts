const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/;

export const DEFAULT_ACCENT_COLOR = "#7B3046";
export const DEFAULT_CANVAS_COLOR = "#D9B9B0";

function clamp(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function hexToRgb(hex: string): [number, number, number] {
  const num = parseInt(hex.slice(1), 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function isValidHexColor(value: string): boolean {
  return HEX_PATTERN.test(value);
}

export function rgbTriplet(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  return `${r} ${g} ${b}`;
}

export function softTintRgbTriplet(hex: string, accentRatio = 0.18): string {
  const [r, g, b] = hexToRgb(hex);
  const mix = (c: number) => clamp(c * accentRatio + 255 * (1 - accentRatio));
  return `${mix(r)} ${mix(g)} ${mix(b)}`;
}
