import Link from "next/link";

import { getMyStores } from "@/lib/stores/queries";

export default async function AdminDashboard() {
  const stores = await getMyStores();

  if (stores.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900">
            Todavía no tenés ninguna tienda
          </h1>
          <p className="mt-2 text-zinc-500">
            Creá tu primera tienda para empezar a vender.
          </p>
          <Link
            href="/admin/create"
            className="mt-6 inline-block rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Crear mi primera tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Mis Tiendas</h1>
        <Link
          href="/admin/create"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Nueva tienda
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/admin/stores/${store.slug}`}
            className="block rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm"
          >
            <p className="font-bold text-zinc-900">{store.name}</p>
            <p className="mt-1 text-sm text-zinc-500">{store.slug}</p>
            <div className="mt-4 flex gap-4 text-sm text-zinc-500">
              <span>{store.productCount} productos</span>
              <span>{store.orderCount} pedidos</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
