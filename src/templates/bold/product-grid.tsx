import type { Product } from "@/lib/supabase/types";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  title?: string;
}

export function ProductGrid({
  products,
  title = "Nuestros productos",
}: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section id="productos" className="bg-brand-background py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-brand-foreground md:text-3xl">
            {title}
          </h2>
          <span className="text-sm text-brand-muted">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
