"use client";

import { useState } from "react";

import { DeleteProductModal } from "./delete-product-modal";

type Props = {
  productId: string;
  productName: string;
  storeSlug: string;
};

export function ProductRowActions({ productId, productName, storeSlug }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        Eliminar
      </button>

      <DeleteProductModal
        productId={productId}
        productName={productName}
        storeSlug={storeSlug}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
