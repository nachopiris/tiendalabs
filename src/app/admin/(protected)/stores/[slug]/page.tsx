import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server";
import { createClient } from "@/lib/supabase/server";

export default async function StoreDashboardPage({
  params,
}: {
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

  const [{ count: productCount }, { count: orderCount }] = await Promise.all([
    supabase
      .from("products")
      .select("*", { head: true, count: "exact" })
      .eq("store_id", store.id),
    supabase
      .from("orders")
      .select("*", { head: true, count: "exact" })
      .eq("store_id", store.id),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900">
        {store.name} — Dashboard
      </h1>
      <p className="mt-2 text-zinc-500">
        Resumen de actividad de tu tienda.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Productos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {productCount ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Pedidos</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">
            {orderCount ?? 0}
          </p>
        </div>
      </div>
    </div>
  );
}
