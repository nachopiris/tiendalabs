import { headers } from "next/headers";

import { requireUser } from "@/lib/auth/server";

/**
 * Auth-guard layout for all protected admin routes.
 *
 * Calls requireUser() which validates the session against the Supabase auth
 * server (getUser() — NOT getSession()). If unauthenticated, redirects to
 * /admin/login?next=<currentPath>.
 *
 * The pathname is read from the `x-pathname` header injected by `src/proxy.ts`
 * — this preserves per-page redirects (e.g. /admin/products → login → back to
 * /admin/products). Falls back to /admin if the header is missing.
 *
 * The sidebar is now rendered per-store in stores/[slug]/layout.tsx.
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/admin";
  await requireUser(pathname);
  return <main className="min-h-screen bg-zinc-50">{children}</main>;
}
