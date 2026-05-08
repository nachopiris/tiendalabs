"use client";

import { useActionState, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import { slugify } from "@/lib/slugify";
import { MAX_IMAGES } from "@/lib/products/constants";
import { INITIAL_ACTION_STATE } from "@/lib/auth/types";
import { createProduct } from "./new/actions";
import { updateProduct } from "./[id]/actions";
import type { ProductFormValues } from "@/lib/products/schema";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductInitialData = ProductFormValues & {
  id: string;
  images: string[];
};

type Props =
  | { mode: "create"; storeSlug: string; initialData?: never }
  | { mode: "edit"; storeSlug: string; initialData: ProductInitialData };

// ─── Submit button ─────────────────────────────────────────────────────────────

function SubmitButton({ mode }: { mode: "create" | "edit" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
    >
      {pending
        ? mode === "create"
          ? "Creando..."
          : "Guardando..."
        : mode === "create"
          ? "Crear producto"
          : "Guardar cambios"}
    </button>
  );
}

// ─── Image grid ────────────────────────────────────────────────────────────────

type ImageGridProps = {
  images: string[];
  storeSlug: string;
  productId?: string;
  onImagesChange: (next: string[]) => void;
};

function ImageGrid({
  images,
  storeSlug,
  productId,
  onImagesChange,
}: ImageGridProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const atCap = images.length >= MAX_IMAGES;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected after an error
    e.target.value = "";

    setUploading(true);
    setUploadError(null);

    const fd = new FormData();
    fd.append("file", file);
    if (productId) {
      fd.append("product_id", productId);
    }

    try {
      const res = await fetch(
        `/admin/stores/${storeSlug}/products/upload`,
        { method: "POST", body: fd },
      );
      const json = (await res.json()) as { url?: string; error?: string };

      if (!res.ok || json.error) {
        setUploadError(json.error ?? "Error al subir la imagen.");
        return;
      }

      if (json.url) {
        if (productId) {
          // Edit mode: DB was already updated by the route; refresh the page
          // data so server re-renders the updated images list from DB, and
          // also update local state so the grid reflects the change immediately.
          onImagesChange([...images, json.url]);
          router.refresh();
        } else {
          // Create mode: accumulate URLs in component state
          onImagesChange([...images, json.url]);
        }
      }
    } catch {
      setUploadError("Error de red al subir la imagen. Probá de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index: number) {
    onImagesChange(images.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div
              key={url}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900/70 text-white hover:bg-zinc-900"
                aria-label={`Eliminar imagen ${i + 1}`}
              >
                <span className="text-xs leading-none">&times;</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add image button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={atCap || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? "Subiendo..." : "Agregar imagen"}
        </button>
        {atCap && (
          <p className="text-xs text-zinc-500">
            Límite de {MAX_IMAGES} imágenes alcanzado.
          </p>
        )}
      </div>

      {uploadError && (
        <p className="text-sm text-red-600" role="alert">
          {uploadError}
        </p>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Hidden fields so the form action receives the current images array */}
      {images.map((url) => (
        <input key={url} type="hidden" name="images[]" value={url} />
      ))}
    </div>
  );
}

// ─── Variants editor ──────────────────────────────────────────────────────────

type Variant = { name: string; options: string[] };
type VariantRow = { id: string; name: string; optionsCSV: string };

function rowsFromInitial(initial: Variant[]): VariantRow[] {
  return initial.map((v) => ({
    id: crypto.randomUUID(),
    name: v.name,
    optionsCSV: v.options.join(", "),
  }));
}

function serializeRows(rows: VariantRow[]): string {
  const variants = rows
    .map((r) => ({
      name: r.name.trim(),
      options: r.optionsCSV
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }))
    .filter((v) => v.name.length > 0);
  return JSON.stringify(variants);
}

function VariantsEditor({ initialVariants }: { initialVariants: Variant[] }) {
  const [rows, setRows] = useState<VariantRow[]>(() =>
    rowsFromInitial(initialVariants),
  );

  function addRow() {
    setRows((rs) => [
      ...rs,
      { id: crypto.randomUUID(), name: "", optionsCSV: "" },
    ]);
  }

  function removeRow(id: string) {
    setRows((rs) => rs.filter((r) => r.id !== id));
  }

  function updateRow(id: string, patch: Partial<Omit<VariantRow, "id">>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.id} className="flex gap-2">
          <input
            type="text"
            placeholder="Talle"
            value={r.name}
            onChange={(e) => updateRow(r.id, { name: e.target.value })}
            className="block w-1/3 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          <input
            type="text"
            placeholder="S, M, L"
            value={r.optionsCSV}
            onChange={(e) => updateRow(r.id, { optionsCSV: e.target.value })}
            className="block flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          <button
            type="button"
            onClick={() => removeRow(r.id)}
            aria-label="Quitar variante"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-500 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600"
          >
            &times;
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        className="rounded-lg border border-dashed border-zinc-300 px-4 py-2 text-sm text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
      >
        + Agregar variante
      </button>

      <input type="hidden" name="variants" value={serializeRows(rows)} />
    </div>
  );
}

// ─── ProductForm ──────────────────────────────────────────────────────────────

export function ProductForm({ mode, storeSlug, initialData }: Props) {
  const action = mode === "create" ? createProduct : updateProduct;
  const [state, formAction] = useActionState(action, INITIAL_ACTION_STATE);

  // Slug auto-generation state (mirrors create-store-form pattern)
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  // Images managed in local state (upload route handles DB persistence in edit)
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden context fields */}
      <input type="hidden" name="store_slug" value={storeSlug} />
      {mode === "edit" && (
        <input type="hidden" name="product_id" value={initialData.id} />
      )}

      {/* ── Datos básicos ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">Datos básicos</h2>

        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-zinc-700"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Ej: Camiseta negra"
            defaultValue={initialData?.name}
            onChange={(e) => {
              if (!slugTouched) {
                setSlug(slugify(e.target.value));
              }
            }}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-zinc-700"
          >
            Slug (URL)
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="camiseta-negra"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
          {slug && (
            <p className="mt-1 text-xs text-zinc-500">
              URL del producto:{" "}
              <span className="font-medium text-zinc-700">
                {storeSlug}.tiendalabs.com/productos/{slug}
              </span>
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700"
          >
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            placeholder="Descripción del producto..."
            defaultValue={initialData?.description}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
          />
        </div>
      </section>

      {/* ── Precios ───────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">Precios</h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Precio */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-zinc-700"
            >
              Precio
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-zinc-300 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
              <span className="rounded-l-lg border-r border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                $
              </span>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                defaultValue={initialData?.price}
                className="block w-full rounded-r-lg border-0 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Precio comparativo */}
          <div>
            <label
              htmlFor="compare_at_price"
              className="block text-sm font-medium text-zinc-700"
            >
              Precio antes <span className="font-normal text-zinc-400">(opcional)</span>
            </label>
            <div className="mt-1 flex items-center rounded-lg border border-zinc-300 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
              <span className="rounded-l-lg border-r border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-500">
                $
              </span>
              <input
                id="compare_at_price"
                name="compare_at_price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                defaultValue={
                  initialData?.compare_at_price ?? undefined
                }
                className="block w-full rounded-r-lg border-0 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Imágenes ──────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">Imágenes</h2>
        <p className="text-xs text-zinc-500">
          Máximo {MAX_IMAGES} imágenes. JPEG, PNG o WebP, hasta 5 MB cada una.
        </p>
        <ImageGrid
          images={images}
          storeSlug={storeSlug}
          productId={mode === "edit" ? initialData.id : undefined}
          onImagesChange={setImages}
        />
      </section>

      {/* ── Variantes ─────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-zinc-900">Variantes</h2>
        <p className="text-xs text-zinc-500">
          Por cada variante ingresá un nombre (ej: Talle, Color) y sus opciones
          separadas por coma. Dejá vacío si no hay variantes.
        </p>
        <VariantsEditor initialVariants={initialData?.variants ?? []} />
      </section>

      {/* ── Estado ────────────────────────────────────────────── */}
      <section>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            value="true"
            defaultChecked={initialData?.is_active ?? true}
            className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500"
          />
          <span className="text-sm font-medium text-zinc-700">
            Producto activo{" "}
            <span className="font-normal text-zinc-400">
              (visible en la tienda)
            </span>
          </span>
        </label>
      </section>

      {/* ── Error global ──────────────────────────────────────── */}
      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      {/* ── Submit ────────────────────────────────────────────── */}
      <div className="flex items-center justify-end border-t border-zinc-100 pt-6">
        <SubmitButton mode={mode} />
      </div>
    </form>
  );
}
