import { ResetPasswordForm } from "./reset-form";

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="mb-1 text-2xl font-bold">Crear nueva contraseña</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Elegí una contraseña nueva para tu cuenta.
      </p>
      <ResetPasswordForm />
    </div>
  );
}
