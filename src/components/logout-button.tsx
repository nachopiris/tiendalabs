"use client";

import { useFormStatus } from "react-dom";

import { logoutAction } from "@/app/admin/actions";

function LogoutSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-50"
    >
      {pending ? "Saliendo..." : "Salir"}
    </button>
  );
}

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <LogoutSubmit />
    </form>
  );
}
