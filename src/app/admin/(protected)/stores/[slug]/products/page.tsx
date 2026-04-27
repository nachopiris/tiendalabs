export default async function StoreProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Productos</h1>
      <p className="mt-2 text-zinc-500">Próximamente — gestión de productos.</p>
    </div>
  );
}
