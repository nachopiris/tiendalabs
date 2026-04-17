export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: Fetch product by ID and show edit form
  return (
    <div>
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <p className="mt-2 text-zinc-500">ID: {id}</p>
    </div>
  );
}
