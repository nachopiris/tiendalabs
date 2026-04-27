import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/server";

type StoreWithCounts = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  orderCount: number;
};

export async function getMyStores(): Promise<StoreWithCounts[]> {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  const { data: stores } = await supabase
    .from("stores")
    .select("id, name, slug")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  if (!stores || stores.length === 0) return [];

  const storesWithCounts = await Promise.all(
    stores.map(async (store) => {
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

      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        productCount: productCount ?? 0,
        orderCount: orderCount ?? 0,
      };
    }),
  );

  return storesWithCounts;
}

export async function getStoreBySlugForOwner(
  slug: string,
  userId: string,
): Promise<{ id: string; name: string; slug: string } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("stores")
    .select("id, name, slug")
    .eq("slug", slug)
    .eq("owner_id", userId)
    .single();

  if (error) return null;
  return data;
}
