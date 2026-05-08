import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { assertStoreOwnership } from "@/lib/stores/auth";
import { uploadProductImage } from "@/lib/products/storage";
import { MAX_IMAGES } from "@/lib/products/constants";

type RouteParams = { params: Promise<{ slug: string }> };

export async function POST(
  request: NextRequest,
  { params }: RouteParams,
): Promise<Response> {
  // Line 1: verify store ownership
  const { slug } = await params;

  const store = await assertStoreOwnership(slug);
  if (!store) {
    return Response.json(
      { error: "No tenés permiso para acceder a esta tienda." },
      { status: 403 },
    );
  }

  // Parse multipart form data
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json(
      { error: "No se pudo procesar el formulario." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json(
      { error: "No se recibió ningún archivo." },
      { status: 400 },
    );
  }

  // Validate MIME type early (storage.ts also validates, but 400 > 500 for client errors)
  const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
  if (!ALLOWED.includes(file.type)) {
    return Response.json(
      {
        error:
          "Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG o WebP.",
      },
      { status: 400 },
    );
  }

  // Validate size early
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "La imagen no puede superar los 5 MB." },
      { status: 400 },
    );
  }

  const productId = formData.get("product_id") as string | null;

  // Enforce image cap and optionally fetch current images in a single query
  let currentImages: string[] = [];
  if (productId) {
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("images")
      .eq("id", productId)
      .eq("store_id", store.id)
      .single();

    if (product) {
      currentImages = product.images ?? [];
      if (currentImages.length >= MAX_IMAGES) {
        return Response.json(
          {
            error: `Ya alcanzaste el límite de ${MAX_IMAGES} imágenes por producto.`,
          },
          { status: 400 },
        );
      }
    }
  }

  // Upload image to Storage
  let publicUrl: string;
  try {
    publicUrl = await uploadProductImage(file, store.id);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error al subir la imagen.";
    return Response.json({ error: message }, { status: 500 });
  }

  // If a product_id was provided, append the new URL to products.images[]
  // so the client doesn't need a separate update call.
  if (productId) {
    const supabase = await createClient();
    await supabase
      .from("products")
      .update({ images: [...currentImages, publicUrl] })
      .eq("id", productId)
      .eq("store_id", store.id);
  }

  return Response.json({ url: publicUrl });
}
