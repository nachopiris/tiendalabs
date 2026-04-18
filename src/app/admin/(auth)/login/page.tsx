import { sanitizeNextUrl } from "@/lib/auth/sanitize";
import { LINK_ERRORS } from "@/lib/auth/messages";

import { DismissibleBanner } from "./dismissible-banner";
import { LoginForm } from "./login-form";

// Next.js 16: searchParams is a Promise — must be awaited
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = sanitizeNextUrl(params.next);
  const linkError = params.error ? LINK_ERRORS[params.error] ?? null : null;

  return (
    <div>
      {linkError ? <DismissibleBanner message={linkError} /> : null}
      <h1 className="mb-1 text-2xl font-bold">Entrar</h1>
      <p className="mb-6 text-sm text-zinc-500">
        Accedé al panel de tu tienda.
      </p>
      <LoginForm next={next} />
    </div>
  );
}
