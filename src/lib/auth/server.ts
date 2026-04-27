import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { AuthUser } from "./types";

/**
 * Returns the currently authenticated user, or null if there is none.
 *
 * Wrapped in React.cache() so concurrent calls from layout + page + nested
 * server components in the same request dedupe to a single getUser() call.
 * Without cache(), each caller creates its own Supabase client, and parallel
 * getUser() calls on an expired JWT race to refresh with the same refresh
 * token — tripping reuse detection and silently revoking the session.
 *
 * Uses getUser() (not getSession()) because getUser() contacts the Auth
 * server to validate the token. The proxy refreshes tokens up-front, so by
 * the time this runs the JWT should already be fresh.
 */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
});

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
