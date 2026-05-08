import { getCurrentUser } from "@/lib/auth/server";
import { getStoreBySlugForOwner } from "@/lib/stores/queries";

/**
 * Verifies that the currently authenticated user owns the store identified by
 * the given slug. Returns the store's id, name, and slug on success, or null
 * if the user is not authenticated or does not own the store.
 *
 * IMPORTANT: This function intentionally does NOT call redirect(). The caller
 * is responsible for deciding what to do with a null result (e.g., redirect to
 * /admin, return an ActionState error, etc.). Calling redirect() from inside a
 * helper that is invoked from a Server Action causes Next.js to throw because
 * redirect() must propagate up from the action itself.
 */
export async function assertStoreOwnership(
  slug: string,
): Promise<{ id: string; name: string; slug: string } | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  return getStoreBySlugForOwner(slug, user.id);
}
