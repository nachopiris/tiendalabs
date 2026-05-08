import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/supabase/types";

/**
 * Returns all products for a store, ordered by position ASC.
 * Owner-scoped: storeId is always included in the WHERE clause.
 * Returns both active and inactive products (admin view).
 */
export async function listProducts(storeId: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("position", { ascending: true });

  if (error) return [];
  return data ?? [];
}

/**
 * Returns a single product by id, scoped to the given store.
 * Returns null if not found or if the product does not belong to the store.
 */
export async function getProductById(
  id: string,
  storeId: string,
): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("store_id", storeId)
    .single();

  if (error) return null;
  return data;
}
