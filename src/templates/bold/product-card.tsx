"use client";

import type { Product } from "@/lib/supabase/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
    <a
      href={`/products/${product.slug}`}
      className="group relative flex flex-col"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-surface">
        {product.images[0] ? (
          <>
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            {/* Hover image — show second image if available, otherwise zoom first */}
            {product.images[1] ? (
              <img
                src={product.images[1]}
                alt={`${product.name} - vista alternativa`}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            ) : (
              <img
                src={product.images[0]}
                alt={product.name}
                className="absolute inset-0 h-full w-full scale-100 object-cover opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
              />
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-brand-muted opacity-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={0.5}
              stroke="currentColor"
              className="h-16 w-16"
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
          <div className="absolute left-3 top-3 rounded-full bg-brand-accent px-2.5 py-1 text-xs font-bold text-brand-accent-foreground">
            -{discountPercent}%
          </div>
        )}

        {/* Quick add button — appears on hover */}
        <div className="absolute bottom-3 left-3 right-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            className="w-full rounded-xl bg-brand-primary py-3 text-sm font-semibold text-brand-primary-foreground shadow-lg transition-opacity hover:opacity-90"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to cart
            }}
          >
            Agregar al carrito
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="font-medium leading-snug text-brand-foreground transition-colors group-hover:text-brand-muted">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-brand-foreground">
            ${product.price.toLocaleString("es-AR")}
          </span>
          {hasDiscount && (
            <span className="text-sm text-brand-muted line-through opacity-60">
              ${product.compare_at_price!.toLocaleString("es-AR")}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
