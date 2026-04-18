"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * Signs the user out and clears session cookies, then redirects to the login page.
 *
 * Called from the LogoutButton in the admin sidebar.
 * signOut() tolerates non-existent sessions gracefully — no error handling needed.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
