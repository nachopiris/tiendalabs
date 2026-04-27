export default async function StoreSettingsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Configuración</h1>
      <p className="mt-2 text-zinc-500">Próximamente — configuración de la tienda.</p>
    </div>
  );
}
