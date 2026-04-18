export default function ProductsListPage() {
  // TODO: Fetch and list products from Supabase
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <button
          type="button"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Nuevo producto
        </button>
      </div>

      <div className="mt-8">
        <p className="text-zinc-500">No hay productos todavía.</p>
      </div>
    </div>
  );
}
