"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth/messages";
import type { ActionState } from "@/lib/auth/types";

export async function resetPasswordAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Ingresá una contraseña nueva." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();

  // updateUser works because the user has an active recovery session
  // established by /auth/confirm?type=recovery after clicking the email link.
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: translateAuthError(error) };
  }

  redirect("/admin");
}
