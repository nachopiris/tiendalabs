"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { slugify } from "@/lib/slugify";
import { INITIAL_ACTION_STATE } from "@/lib/auth/types";
import { createStoreAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
    >
      {pending ? "Creando..." : "Crear tienda"}
    </button>
  );
}

export function CreateStoreForm() {
  const [state, formAction] = useActionState(createStoreAction, INITIAL_ACTION_STATE);
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-zinc-700"
        >
          Nombre de la tienda
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Mi Tienda"
          required
          onChange={(e) => {
            if (!slugTouched) {
              setSlug(slugify(e.target.value));
            }
          }}
          className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-zinc-700"
        >
          Dirección de tu tienda
        </label>
        <div className="mt-1 flex items-center rounded-lg border border-zinc-300 focus-within:border-zinc-500 focus-within:ring-1 focus-within:ring-zinc-500">
          <input
            id="slug"
            name="slug"
            type="text"
            placeholder="mi-tienda"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="block w-full rounded-l-lg border-0 px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
          />
          <span className="whitespace-nowrap rounded-r-lg bg-zinc-50 px-3 py-2 text-sm text-zinc-500 border-l border-zinc-300">
            .tiendalabs.com
          </span>
        </div>
        {slug && (
          <p className="mt-1.5 text-xs text-zinc-500">
            Tu tienda va a estar en <span className="font-medium text-zinc-700">{slug}.tiendalabs.com</span>
          </p>
        )}
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
