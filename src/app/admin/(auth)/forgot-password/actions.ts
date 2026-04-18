"use server";

import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/auth/messages";

/**
 * Forgot-password action state includes a `sent` flag to distinguish
 * "no submission yet / error" from "email dispatched, show confirmation".
 *
 * NOTE: type and initial state live in the form component, not here.
 * "use server" files can ONLY export async functions (Next.js constraint).
 */

export async function forgotPasswordAction(
  _prevState: { error: string | null; sent: boolean },
  formData: FormData,
): Promise<{ error: string | null; sent: boolean }> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Ingresá tu email.", sent: false };
  }

  const supabase = await createClient();

  // The confirmation route handler needs to know where to redirect AFTER
  // verifying the recovery token. We pass next=/admin/reset-password so the
  // user lands on the reset form with an active recovery session.
  const redirectTo = `${
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  }/auth/confirm?type=recovery&next=${encodeURIComponent("/admin/reset-password")}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    return { error: translateAuthError(error), sent: false };
  }

  // Security: Supabase returns no error for non-existent emails (by design).
  // We always show the success state to avoid leaking whether an address exists.
  return { error: null, sent: true };
}
