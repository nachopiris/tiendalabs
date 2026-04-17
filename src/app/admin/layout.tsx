export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Add auth check — only store owner can access admin
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Admin Sidebar */}
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
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
