"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth/messages";
import { sanitizeNextUrl } from "@/lib/auth/sanitize";
import type { ActionState } from "@/lib/auth/types";

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "");

  if (!email || !password) {
    return { error: "Ingresá tu email y contraseña." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: translateAuthError(error) };
  }

  redirect(sanitizeNextUrl(next));
}
