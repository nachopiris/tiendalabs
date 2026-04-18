export default function AdminDashboard() {
  // TODO: Show store stats — orders, revenue, visits
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2 text-zinc-500">
        Bienvenido al panel de administración.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Órdenes hoy</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Ingresos del mes</p>
          <p className="mt-2 text-3xl font-bold">$0</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-500">Productos activos</p>
          <p className="mt-2 text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
