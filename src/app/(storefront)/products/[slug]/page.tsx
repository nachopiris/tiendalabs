import { getStoreBySlug } from "@/lib/store-context";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = await getStoreBySlug();

  if (!store) {
    notFound();
  }

  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", store.id)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  const product = data as Product | null;

  if (!product) {
    notFound();
  }

  // TODO: Render product detail using template's product detail view
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mt-4 text-lg text-zinc-600">{product.description}</p>
      <p className="mt-4 text-2xl font-bold">
        ${product.price.toLocaleString("es-AR")}
      </p>
    </div>
  );
}
