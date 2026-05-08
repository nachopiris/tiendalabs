"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { assertStoreOwnership } from "@/lib/stores/auth";
import type { ActionState } from "@/lib/auth/types";

/**
 * Deletes a product row from the database.
 *
 * TECH DEBT: Images stored in Supabase Storage are NOT deleted (orphan
 * tolerance — design decision D5). A future cleanup job should scan for
 * storage objects with no matching products.images[] reference.
 */
export async function deleteProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Line 1: verify store ownership
  const storeSlug = formData.get("store_slug") as string | null;
  if (!storeSlug) {
    return { error: "Faltó el identificador de la tienda." };
  }

  const store = await assertStoreOwnership(storeSlug);
  if (!store) {
    redirect("/admin");
  }

  const productId = formData.get("product_id") as string | null;
  if (!productId) {
    return { error: "Faltó el identificador del producto." };
  }

  const supabase = await createClient();

  // Scoped delete: product must belong to this store
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) {
    return { error: "Hubo un error al eliminar el producto. Probá de nuevo." };
  }

  revalidatePath(`/admin/stores/${storeSlug}/products`);
  return { error: null };
}

/**
 * Flips the is_active boolean for a product.
 */
export async function toggleProductActive(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // Line 1: verify store ownership
  const storeSlug = formData.get("store_slug") as string | null;
  if (!storeSlug) {
    return { error: "Faltó el identificador de la tienda." };
  }

  const store = await assertStoreOwnership(storeSlug);
  if (!store) {
    redirect("/admin");
  }

  const productId = formData.get("product_id") as string | null;
  if (!productId) {
    return { error: "Faltó el identificador del producto." };
  }

  const currentActive = formData.get("is_active") === "true";

  const supabase = await createClient();

  // Scoped update: product must belong to this store
  const { error } = await supabase
    .from("products")
    .update({ is_active: !currentActive })
    .eq("id", productId)
    .eq("store_id", store.id);

  if (error) {
    return {
      error: "Hubo un error al cambiar el estado del producto. Probá de nuevo.",
    };
  }

  revalidatePath(`/admin/stores/${storeSlug}/products`);
  return { error: null };
}
