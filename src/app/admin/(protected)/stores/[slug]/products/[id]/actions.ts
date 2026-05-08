"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { assertStoreOwnership } from "@/lib/stores/auth";
import { productFormSchema } from "@/lib/products/schema";
import { slugify } from "@/lib/slugify";
import type { ActionState } from "@/lib/auth/types";
import type { ProductVariant } from "@/lib/supabase/types";

export async function updateProduct(
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

  // Parse variants from JSON textarea
  const variantsRaw = formData.get("variants") as string | null;
  let parsedVariants: unknown = [];
  if (variantsRaw && variantsRaw.trim()) {
    try {
      parsedVariants = JSON.parse(variantsRaw);
    } catch {
      return { error: "Las variantes no son JSON válido." };
    }
  }

  // Parse images array (sent as multiple values)
  const imagesRaw = formData.getAll("images[]") as string[];

  // Auto-generate slug from name if blank
  const nameRaw = formData.get("name") as string | null;
  let slugRaw = formData.get("slug") as string | null;
  if (!slugRaw?.trim() && nameRaw?.trim()) {
    slugRaw = slugify(nameRaw.trim());
  }

  const result = productFormSchema.safeParse({
    name: nameRaw,
    slug: slugRaw,
    description: formData.get("description"),
    price: formData.get("price"),
    compare_at_price: formData.get("compare_at_price"),
    images: imagesRaw,
    variants: parsedVariants,
    is_active: formData.get("is_active") ?? "false",
  });

  if (!result.success) {
    const first = result.error.issues[0];
    return { error: first?.message ?? "Datos del formulario inválidos." };
  }

  const data = result.data;

  const supabase = await createClient();

  // Scoped update: product must belong to this store (double ownership check)
  const { error: updateError } = await supabase
    .from("products")
    .update({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      compare_at_price: data.compare_at_price,
      images: data.images,
      variants: data.variants as ProductVariant[],
      is_active: data.is_active,
    })
    .eq("id", productId)
    .eq("store_id", store.id);

  if (updateError) {
    if (updateError.code === "23505") {
      return {
        error:
          "Ya existe un producto con ese slug en esta tienda. Cambiá el nombre o el slug.",
      };
    }
    return { error: "Hubo un error al actualizar el producto. Probá de nuevo." };
  }

  redirect(`/admin/stores/${storeSlug}/products`);
}
