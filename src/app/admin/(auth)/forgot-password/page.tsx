import { ForgotPasswordForm } from "./forgot-form";

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold">Recuperar contraseña</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Te enviamos un email con las instrucciones para crear una contraseña
        nueva.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
