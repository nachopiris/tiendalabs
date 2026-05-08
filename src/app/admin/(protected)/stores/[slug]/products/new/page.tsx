import Link from "next/link";
import { redirect } from "next/navigation";

import { assertStoreOwnership } from "@/lib/stores/auth";
import { ProductForm } from "../product-form";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await assertStoreOwnership(slug);
  if (!store) {
    redirect("/admin");
  }

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

      <h1 className="mb-8 text-2xl font-bold text-zinc-900">Nuevo producto</h1>

      <ProductForm mode="create" storeSlug={slug} />
    </div>
  );
}
