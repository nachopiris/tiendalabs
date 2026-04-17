import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { Store } from "@/lib/supabase/types";

/**
 * Resolves the current store from the request headers.
 * The proxy sets `x-store-slug` on every request.
 *
 * Call this in Server Components or layouts to get the active store.
 */
export async function getStoreBySlug(): Promise<Store | null> {
  const headerStore = await headers();
  const slug = headerStore.get("x-store-slug");

  if (!slug) return null;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return data;
}
