import type { Product } from "@/lib/supabase/types";

interface HeroSectionProps {
  product: Product;
  storeName: string;
}

export function HeroSection({ product, storeName }: HeroSectionProps) {
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) /
          product.compare_at_price!) *
          100,
      )
    : 0;

  return (
    <section className="relative overflow-hidden bg-brand-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
        {/* Text content */}
        <div className="flex flex-col gap-6">
          {hasDiscount && (
            <span className="w-fit rounded-full bg-brand-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-accent">
              {discountPercent}% OFF
            </span>
          )}

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-brand-foreground md:text-5xl lg:text-6xl">
            {product.name}
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-brand-muted">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-foreground">
              ${product.price.toLocaleString("es-AR")}
            </span>
            {hasDiscount && (
              <span className="text-xl text-brand-muted line-through opacity-60">
                ${product.compare_at_price!.toLocaleString("es-AR")}
              </span>
            )}
          </div>

          {/* CTA */}
          <a
            href={`/products/${product.slug}`}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-8 py-4 text-base font-semibold text-brand-primary-foreground transition-all hover:opacity-90 hover:shadow-lg md:w-auto"
          >
            Comprar ahora
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </a>
        </div>

        {/* Hero image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-brand-background shadow-2xl">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-brand-muted opacity-40">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={0.5}
                stroke="currentColor"
                className="h-24 w-24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
                />
              </svg>
            </div>
          )}

          {/* Discount badge */}
          {hasDiscount && (
            <div className="absolute right-4 top-4 rounded-full bg-brand-accent px-3 py-1.5 text-sm font-bold text-brand-accent-foreground shadow-lg">
              -{discountPercent}%
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
