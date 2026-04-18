"use client";

import Link from "next/link";
import { useActionState } from "react";

import { MSG_CONFIRM_EMAIL } from "@/lib/auth/messages";
import { signupAction } from "./actions";

type SignupActionState = { error: string | null; sent: boolean };
const INITIAL_SIGNUP_STATE: SignupActionState = { error: null, sent: false };

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    INITIAL_SIGNUP_STATE,
  );

  if (state.sent) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">¡Casi listo!</h2>
        <p className="text-sm text-zinc-600">{MSG_CONFIRM_EMAIL}</p>
        <Link
          href="/admin/login"
          className="inline-block text-sm font-medium text-zinc-900 underline"
        >
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700">
          Contraseña
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
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <div className="text-center text-sm">
        <Link href="/admin/login" className="text-zinc-600 hover:text-zinc-900">
          ¿Ya tenés cuenta? Entrá
        </Link>
      </div>
    </form>
  );
}
