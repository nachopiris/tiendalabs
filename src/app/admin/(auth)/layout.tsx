import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/server";

/**
 * Layout for public auth pages (login, signup, forgot-password).
 *
 * If the user is already authenticated, redirect them to the dashboard —
 * no point showing a login form to someone already logged in.
 *
 * NOTE: /admin/reset-password lives in (protected)/, not here, so
 * recovery-session users are handled correctly: they have a valid session
 * after verifyOtp() and land directly on the reset-password page inside
 * (protected)/. They never hit this layout.
 */
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (user) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
