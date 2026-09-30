const LIGHT_INK = "#FFFFFF";
const DARK_INK = "#0A0E17";

/** WCAG relative luminance of a `#RRGGBB` color. */
export function relativeLuminance(hex: string): number {
  const value = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    },
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two `#RRGGBB` colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort(
    (x, y) => y - x,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

/** Text color (white or near-black) with the higher contrast on `background`. */
export function inkFor(background: string): string {
  return contrastRatio(background, LIGHT_INK) >=
    contrastRatio(background, DARK_INK)
    ? LIGHT_INK
    : DARK_INK;
}
