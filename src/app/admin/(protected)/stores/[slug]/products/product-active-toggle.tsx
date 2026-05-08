"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { INITIAL_ACTION_STATE } from "@/lib/auth/types";
import { toggleProductActive } from "./actions";

type Props = {
  productId: string;
  storeSlug: string;
  isActive: boolean;
};

function ToggleButton({ isActive }: { isActive: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={
        isActive ? "Desactivar producto" : "Activar producto"
      }
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium transition disabled:opacity-50 ${
        isActive
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
      }`}
    >
      {pending ? "..." : isActive ? "Activo" : "Inactivo"}
    </button>
  );
}

export function ProductActiveToggle({
  productId,
  storeSlug,
  isActive,
}: Props) {
  const [, formAction] = useActionState(
    toggleProductActive,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction}>
      <input type="hidden" name="store_slug" value={storeSlug} />
      <input type="hidden" name="product_id" value={productId} />
      <input type="hidden" name="is_active" value={String(isActive)} />
      <ToggleButton isActive={isActive} />
    </form>
  );
}
