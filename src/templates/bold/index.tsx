import type { TemplateProps } from "../types";
import { AnnouncementBar } from "./announcement-bar";
import { BrandProvider } from "./brand-provider";
import { Header } from "./header";
import { HeroSection } from "./hero-section";
import { Newsletter } from "./newsletter";
import { ProductGrid } from "./product-grid";
import { StoreFooter } from "./store-footer";
import { Testimonials } from "./testimonials";
import { TrustBar } from "./trust-bar";
import { getPalette } from "./palettes";

/**
 * Bold Template — Fully data-driven storefront.
 *
 * All content (messages, testimonials, products) comes from store config.
 * All colors come from the selected brand palette.
 * All sections respect conversion_features toggles.
 *
 * Sections (in order):
 * 1. Announcement Bar (if messages exist)
 * 2. Header
 * 3. Hero (featured product)
 * 4. Trust Bar (if trust_badges enabled)
 * 5. Product Grid (remaining products)
 * 6. Testimonials (if social_proof enabled AND testimonials exist)
 * 7. Newsletter
 * 8. Footer
 */
export function BoldTemplate({ store, products }: TemplateProps) {
  const palette = getPalette(store.branding.palette_id);
  const { conversion_features, announcement_messages, testimonials } =
    store.config;

  const featuredProduct = products[0];
  const gridProducts = products.length > 1 ? products.slice(1) : products;

  return (
    <BrandProvider palette={palette}>
      <div className="min-h-screen bg-brand-background text-brand-foreground">
        {announcement_messages.length > 0 && (
          <AnnouncementBar messages={announcement_messages} />
        )}

        <Header store={store} />

        {featuredProduct ? (
          <>
            <HeroSection product={featuredProduct} storeName={store.name} />

            {conversion_features.trust_badges && <TrustBar />}

            <ProductGrid products={gridProducts} />
          </>
        ) : (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-brand-foreground">
                Próximamente
              </h2>
              <p className="mt-2 text-brand-muted">
                Estamos preparando los productos. Volvé pronto.
              </p>
            </div>
          </div>
        )}

        {conversion_features.social_proof && testimonials.length > 0 && (
          <Testimonials testimonials={testimonials} />
        )}

        <Newsletter />

        <StoreFooter store={store} />
      </div>
    </BrandProvider>
  );
}
