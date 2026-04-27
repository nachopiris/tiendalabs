"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth/server";
import type { ActionState } from "@/lib/auth/types";

export async function createStoreAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const name = formData.get("name") as string | null;
  const slug = formData.get("slug") as string | null;

  if (!name?.trim()) {
    return { error: "Completá el nombre de la tienda." };
  }
  if (!slug?.trim()) {
    return { error: "Completá el slug." };
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "El slug solo puede tener letras minúsculas, números y guiones." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("stores")
    .insert({ name: name.trim(), slug, owner_id: user.id });

  if (error) {
    if (error.code === "23505") {
      return { error: "Ese slug ya está en uso. Elegí otro." };
    }
    return { error: "Hubo un error al crear la tienda. Probá de nuevo." };
  }

  redirect(`/admin/stores/${slug}`);
}
