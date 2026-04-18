import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Crear cuenta</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Arrancá a crear tu tienda en TiendaLabs.
      </p>
      <SignupForm />
    </div>
  );
}
