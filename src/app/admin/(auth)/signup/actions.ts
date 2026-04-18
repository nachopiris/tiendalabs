"use server";

import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth/messages";

/**
 * Signup action state type — includes a `sent` flag to distinguish
 * "no submission yet / error" from "signup succeeded, show confirmation".
 *
 * NOTE: type and initial state live in the form component, not here.
 * "use server" files can ONLY export async functions (Next.js constraint).
 */

export async function signupAction(
  _prevState: { error: string | null; sent: boolean },
  formData: FormData,
): Promise<{ error: string | null; sent: boolean }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingresá un email y una contraseña.", sent: false };
  }

  if (password.length < 6) {
    return {
      error: "La contraseña debe tener al menos 6 caracteres.",
      sent: false,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Supabase sends a confirmation email with a token that redirects here.
      // NEXT_PUBLIC_SITE_URL must be set in .env.local for production.
      emailRedirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
      }/auth/confirm`,
    },
  });

  if (error) {
    return { error: translateAuthError(error), sent: false };
  }

  return { error: null, sent: true };
}
