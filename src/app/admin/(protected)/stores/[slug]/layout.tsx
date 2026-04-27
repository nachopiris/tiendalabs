import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single();

  if (!store) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
        <div className="flex h-16 flex-col justify-center border-b border-zinc-200 px-6">
          <span className="text-base font-bold text-zinc-900">{store.name}</span>
          <Link
            href="/admin"
            className="mt-0.5 text-xs text-zinc-500 hover:text-zinc-700"
          >
            ← Mis Tiendas
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <Link
            href={`/admin/stores/${store.slug}`}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Dashboard
          </Link>
          <Link
            href={`/admin/stores/${store.slug}/products`}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Productos
          </Link>
          <Link
            href={`/admin/stores/${store.slug}/orders`}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Pedidos
          </Link>
          <Link
            href={`/admin/stores/${store.slug}/settings`}
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Configuración
          </Link>
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main content — offset to account for fixed sidebar */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
