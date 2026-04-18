"use client";

import Link from "next/link";
import { useActionState } from "react";

import { INITIAL_ACTION_STATE } from "@/lib/auth/types";
import { loginAction } from "./actions";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_ACTION_STATE,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

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
          autoComplete="current-password"
          required
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none"
        />
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
        {isPending ? "Entrando..." : "Entrar"}
      </button>

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/admin/forgot-password"
          className="text-zinc-600 hover:text-zinc-900"
        >
          Olvidé mi contraseña
        </Link>
        <Link href="/admin/signup" className="text-zinc-600 hover:text-zinc-900">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
}
