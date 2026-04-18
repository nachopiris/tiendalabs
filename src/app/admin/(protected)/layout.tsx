import { headers } from "next/headers";

import { requireUser } from "@/lib/auth/server";
import { LogoutButton } from "@/components/logout-button";

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
 */
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "/admin";
  await requireUser(pathname);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-200 bg-white">
        <div className="flex h-16 items-center border-b border-zinc-200 px-6">
          <span className="text-lg font-bold">TiendaLabs</span>
        </div>
        <nav className="space-y-1 p-4">
          <a
            href="/admin"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Dashboard
          </a>
          <a
            href="/admin/products"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Productos
          </a>
          <a
            href="/admin/orders"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Órdenes
          </a>
          <a
            href="/admin/settings"
            className="block rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            Configuración
          </a>
          <div className="mt-4 border-t border-zinc-200 pt-4">
            <LogoutButton />
          </div>
        </nav>
      </aside>

      {/* Main content — offset to account for fixed sidebar */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
