import Link from "next/link";
import { redirect } from "next/navigation";

import { assertStoreOwnership } from "@/lib/stores/auth";
import { listProducts } from "@/lib/products/queries";
import { ProductActiveToggle } from "./product-active-toggle";
import { ProductRowActions } from "./product-row-actions";

export default async function StoreProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const store = await assertStoreOwnership(slug);
  if (!store) {
    redirect("/admin");
  }

  const products = await listProducts(store.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Productos</h1>
        <Link
          href={`/admin/stores/${slug}/products/new`}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Nuevo producto
        </Link>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-zinc-500">
            Aún no hay productos. Creá el primero.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-zinc-200 bg-zinc-50 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-50">
                  {/* Thumbnail + name + slug */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-zinc-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-zinc-400">{product.slug}</p>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-3 text-zinc-700">
                    ${product.price.toLocaleString("es-AR")}
                    {product.compare_at_price && (
                      <span className="ml-2 text-xs text-zinc-400 line-through">
                        ${product.compare_at_price.toLocaleString("es-AR")}
                      </span>
                    )}
                  </td>

                  {/* Active toggle */}
                  <td className="px-4 py-3">
                    <ProductActiveToggle
                      productId={product.id}
                      storeSlug={slug}
                      isActive={product.is_active}
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/stores/${slug}/products/${product.id}`}
                        className="rounded-lg border border-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                      >
                        Editar
                      </Link>
                      <ProductRowActions
                        productId={product.id}
                        productName={product.name}
                        storeSlug={slug}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
