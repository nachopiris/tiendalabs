"use client";

import { useActionState } from "react";

import { INITIAL_ACTION_STATE } from "@/lib/auth/types";
import { resetPasswordAction } from "./actions";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Contraseña nueva
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
        <p className="text-xs text-zinc-500">Mínimo 6 caracteres.</p>
      </div>

      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}
