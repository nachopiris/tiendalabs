"use client";

import Link from "next/link";
import { useActionState } from "react";

import { MSG_PASSWORD_RESET_SENT } from "@/lib/auth/messages";
import { forgotPasswordAction } from "./actions";

type ForgotActionState = { error: string | null; sent: boolean };
const INITIAL_FORGOT_STATE: ForgotActionState = { error: null, sent: false };

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    INITIAL_FORGOT_STATE,
  );

  if (state.sent) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-900">Revisá tu email</h2>
        <p className="text-sm text-zinc-600">{MSG_PASSWORD_RESET_SENT}</p>
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
        {isPending ? "Enviando..." : "Enviar link"}
      </button>

      <div className="text-center text-sm">
        <Link href="/admin/login" className="text-zinc-600 hover:text-zinc-900">
          Volver al login
        </Link>
      </div>
    </form>
  );
}
