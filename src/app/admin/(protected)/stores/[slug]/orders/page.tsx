export default async function StoreOrdersPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Pedidos</h1>
      <p className="mt-2 text-zinc-500">Próximamente — gestión de pedidos.</p>
    </div>
  );
}
