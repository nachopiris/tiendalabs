import Link from "next/link";
import { redirect, notFound } from "next/navigation";

import { assertStoreOwnership } from "@/lib/stores/auth";
import { getProductById } from "@/lib/products/queries";
import { ProductForm } from "../product-form";
import type { ProductInitialData } from "../product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  const store = await assertStoreOwnership(slug);
  if (!store) {
    redirect("/admin");
  }

  const product = await getProductById(id, store.id);
  if (!product) {
    notFound();
  }

  const initialData: ProductInitialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    compare_at_price: product.compare_at_price,
    images: product.images,
    variants: product.variants,
    is_active: product.is_active,
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 flex items-center gap-4">
        <Link
          href={`/admin/stores/${slug}/products`}
          className="text-sm text-zinc-500 hover:text-zinc-700"
        >
          ← Volver a productos
        </Link>
      </div>

      <h1 className="mb-8 text-2xl font-bold text-zinc-900">
        Editar producto
      </h1>

      <ProductForm mode="edit" storeSlug={slug} initialData={initialData} />
    </div>
  );
}
