import type { BrandPalette } from "./palettes";

interface BrandProviderProps {
  palette: BrandPalette;
  children: React.ReactNode;
}

/**
 * Injects the brand palette as CSS custom properties on a wrapping div.
 * All Bold template components read brand colors through `bg-brand-primary`,
 * `text-brand-foreground` etc. classes, which reference these variables.
 *
 * This keeps the template fully data-driven: changing the palette in the
 * database instantly restyles the entire storefront without code changes.
 */
export function BrandProvider({ palette, children }: BrandProviderProps) {
  const cssVars = {
    "--brand-primary": palette.primary,
    "--brand-primary-foreground": palette.primaryForeground,
    "--brand-accent": palette.accent,
    "--brand-accent-foreground": palette.accentForeground,
    "--brand-background": palette.background,
    "--brand-surface": palette.surface,
    "--brand-foreground": palette.foreground,
    "--brand-muted": palette.muted,
    "--brand-border": palette.border,
  } as React.CSSProperties;

  return <div style={cssVars}>{children}</div>;
}
