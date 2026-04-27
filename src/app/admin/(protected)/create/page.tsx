import { CreateStoreForm } from "./create-store-form";

export default function CreateStorePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-2xl font-bold">Crear nueva tienda</h1>
      <p className="mt-2 text-zinc-500">
        Elegí un nombre y una dirección para tu tienda.
      </p>
      <div className="mt-8">
        <CreateStoreForm />
      </div>
    </div>
  );
}
