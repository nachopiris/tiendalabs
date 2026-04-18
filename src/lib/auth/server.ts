import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { AuthUser } from "./types";

/**
 * Returns the currently authenticated user, or null if there is none.
 *
 * Uses `getUser()` — NOT `getSession()` — per Supabase SSR best practices:
 * getUser() validates the token against the auth server on every call,
 * whereas getSession() relies on the local (potentially stale) cookie.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

/**
 * Returns the authenticated user, or redirects to the login page.
 *
 * Call this from Server Components / layouts that must be protected.
 * The caller must provide `nextPath` — the current page's pathname — so the
 * login page can redirect back after a successful sign-in.
 *
 * @param nextPath - Absolute pathname to return to after login (e.g. "/admin/products").
 */
export async function requireUser(nextPath: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    const encoded = encodeURIComponent(nextPath);
    redirect(`/admin/login?next=${encoded}`);
  }
  return user;
}
