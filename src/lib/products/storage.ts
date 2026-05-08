import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";

const BUCKET = "product-images";
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/**
 * Builds the Storage path for a product image.
 * Pattern: products/{storeId}/{uuid}/{slugifiedFilename}
 *
 * The UUID is generated before the insert so the path does not depend on
 * having a product_id in the database yet (supports the create flow).
 */
export function buildStoragePath(
  storeId: string,
  uuid: string,
  filename: string,
): string {
  const ext = filename.split(".").pop() ?? "jpg";
  const baseName = filename.replace(/\.[^.]+$/, "");
  const safeFilename = `${slugify(baseName)}.${ext}`;
  return `products/${storeId}/${uuid}/${safeFilename}`;
}

/**
 * Uploads a product image to Supabase Storage and returns the public URL.
 *
 * Validates:
 * - MIME type must be image/jpeg, image/png, or image/webp
 * - File size must not exceed 5 MB
 *
 * Throws an Error with a Spanish message on validation failure or upload error.
 */
export async function uploadProductImage(
  file: File,
  storeId: string,
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error(
      "Tipo de archivo no permitido. Solo se aceptan imágenes JPEG, PNG o WebP.",
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen no puede superar los 5 MB.");
  }

  const uuid = crypto.randomUUID();
  const path = buildStoragePath(storeId, uuid, file.name);

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    throw new Error(`Error al subir la imagen: ${error.message}`);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

/**
 * Deletes a product image from Supabase Storage by its full path.
 * Silently ignores errors (orphan tolerance — D5/D6 design decisions).
 */
export async function deleteProductImage(path: string): Promise<void> {
  const supabase = await createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}
