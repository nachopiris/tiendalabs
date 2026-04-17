import { getStoreBySlug } from "@/lib/store-context";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/templates/registry";

export default async function HomePage() {
  const store = await getStoreBySlug();

  // No store resolved — show marketing landing
  if (!store) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
        <h1 className="text-center text-4xl font-bold">TiendaLabs</h1>
        <p className="max-w-md text-center text-lg text-zinc-600">
          Creá tiendas de alta conversión para validar tus productos
          rápidamente.
        </p>
      </div>
    );
  }

  // Store resolved — render storefront with template
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("is_active", true)
    .order("position", { ascending: true });

  const Template = getTemplate(store.template_id);

  return <Template store={store} products={products ?? []} />;
}
