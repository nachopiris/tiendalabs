/**
 * Curated brand palettes for the Bold template.
 *
 * Each palette defines semantic colors that get injected as CSS variables.
 * Components use these via the `brand-*` classes defined in globals.css.
 *
 * Palettes are chosen to cover common dropshipping niches while guaranteeing
 * WCAG AA contrast and good photo compatibility.
 */

export interface BrandPalette {
  id: string;
  name: string;
  description: string;
  /** Main brand color — used for primary buttons and CTAs */
  primary: string;
  /** Text color that goes ON TOP of primary (must contrast with primary) */
  primaryForeground: string;
  /** Accent color — used for highlights, badges, links */
  accent: string;
  /** Text color on accent */
  accentForeground: string;
  /** Page background */
  background: string;
  /** Alternate background for sections (cards, alternating bands) */
  surface: string;
  /** Main text color */
  foreground: string;
  /** Muted text color (secondary info) */
  muted: string;
  /** Border color for dividers, card borders */
  border: string;
}

const PALETTES: Record<string, BrandPalette> = {
  midnight: {
    id: "midnight",
    name: "Midnight",
    description:
      "Universal, premium, trustworthy. Black and white with blue accents. Perfect for tech, accessories, and serious brands.",
    primary: "#09090b",
    primaryForeground: "#ffffff",
    accent: "#2563eb",
    accentForeground: "#ffffff",
    background: "#ffffff",
    surface: "#fafafa",
    foreground: "#09090b",
    muted: "#71717a",
    border: "#e4e4e7",
  },
  sunset: {
    id: "sunset",
    name: "Sunset",
    description:
      "Warm and energetic. Orange with amber accents. Perfect for food, kids, lifestyle.",
    primary: "#ea580c",
    primaryForeground: "#ffffff",
    accent: "#fbbf24",
    accentForeground: "#1c1917",
    background: "#fffbeb",
    surface: "#ffffff",
    foreground: "#1c1917",
    muted: "#78716c",
    border: "#fde68a",
  },
  forest: {
    id: "forest",
    name: "Forest",
    description:
      "Natural and sustainable. Deep green with lime accents. Perfect for organic, wellness, eco-friendly.",
    primary: "#15803d",
    primaryForeground: "#ffffff",
    accent: "#65a30d",
    accentForeground: "#ffffff",
    background: "#fafaf9",
    surface: "#ffffff",
    foreground: "#1c1917",
    muted: "#78716c",
    border: "#e7e5e4",
  },
  rose: {
    id: "rose",
    name: "Rose",
    description:
      "Feminine and refined. Pink with soft tones. Perfect for beauty, fashion, jewelry.",
    primary: "#be185d",
    primaryForeground: "#ffffff",
    accent: "#f472b6",
    accentForeground: "#500724",
    background: "#fdf2f8",
    surface: "#ffffff",
    foreground: "#500724",
    muted: "#9d174d",
    border: "#fbcfe8",
  },
  ocean: {
    id: "ocean",
    name: "Ocean",
    description:
      "Fresh and sporty. Deep blue with cyan accents. Perfect for fitness, aquatic, summer products.",
    primary: "#0369a1",
    primaryForeground: "#ffffff",
    accent: "#06b6d4",
    accentForeground: "#ffffff",
    background: "#f0f9ff",
    surface: "#ffffff",
    foreground: "#0c4a6e",
    muted: "#0369a1",
    border: "#bae6fd",
  },
  electric: {
    id: "electric",
    name: "Electric",
    description:
      "Bold and youthful. Black with neon yellow accents. Perfect for streetwear, gaming, Gen-Z brands.",
    primary: "#09090b",
    primaryForeground: "#eab308",
    accent: "#eab308",
    accentForeground: "#09090b",
    background: "#ffffff",
    surface: "#fefce8",
    foreground: "#09090b",
    muted: "#52525b",
    border: "#fef08a",
  },
  cream: {
    id: "cream",
    name: "Cream",
    description:
      "Minimalist and warm. Beige tones with brown accents. Perfect for home decor, crafts, premium products.",
    primary: "#78350f",
    primaryForeground: "#fefdfb",
    accent: "#d97706",
    accentForeground: "#ffffff",
    background: "#fefdfb",
    surface: "#fef3c7",
    foreground: "#451a03",
    muted: "#92400e",
    border: "#fde68a",
  },
  violet: {
    id: "violet",
    name: "Violet",
    description:
      "Creative and mystical. Deep violet with lavender accents. Perfect for art, esoteric, creative tech.",
    primary: "#6d28d9",
    primaryForeground: "#ffffff",
    accent: "#a78bfa",
    accentForeground: "#2e1065",
    background: "#faf5ff",
    surface: "#ffffff",
    foreground: "#2e1065",
    muted: "#6d28d9",
    border: "#ddd6fe",
  },
} as const;

export const DEFAULT_PALETTE_ID = "midnight";

export function getPalette(paletteId: string | undefined | null): BrandPalette {
  if (!paletteId || !(paletteId in PALETTES)) {
    return PALETTES[DEFAULT_PALETTE_ID];
  }
  return PALETTES[paletteId];
}

export function getAvailablePalettes(): BrandPalette[] {
  return Object.values(PALETTES);
}

export { PALETTES };
