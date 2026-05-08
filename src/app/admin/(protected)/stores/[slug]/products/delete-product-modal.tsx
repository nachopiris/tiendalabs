"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { INITIAL_ACTION_STATE } from "@/lib/auth/types";
import { deleteProduct } from "./actions";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  productId: string;
  productName: string;
  storeSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

// ─── Submit button ─────────────────────────────────────────────────────────────

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
    >
      {pending ? "Eliminando..." : "Eliminar"}
    </button>
  );
}

// ─── DeleteProductModal ────────────────────────────────────────────────────────

export function DeleteProductModal({
  productId,
  productName,
  storeSlug,
  open,
  onOpenChange,
}: Props) {
  const [state, formAction] = useActionState(deleteProduct, INITIAL_ACTION_STATE);

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => onOpenChange(false)}
    >
      {/* Modal panel — stop click propagation so clicking inside doesn't close */}
      <div
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold text-zinc-900">
          ¿Eliminar producto?
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Vas a eliminar{" "}
          <span className="font-medium text-zinc-900">{productName}</span>. Esta
          acción no se puede deshacer.
        </p>

        {state.error && (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {state.error}
          </p>
        )}

        <form action={formAction} className="mt-6 flex justify-end gap-3">
          {/* Hidden ownership fields */}
          <input type="hidden" name="store_slug" value={storeSlug} />
          <input type="hidden" name="product_id" value={productId} />

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Cancelar
          </button>
          <DeleteButton />
        </form>
      </div>
    </div>
  );
}
