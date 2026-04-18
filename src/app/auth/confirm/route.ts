import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { sanitizeNextUrl } from "@/lib/auth/sanitize";

type EmailOtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email";

/**
 * Email confirmation / recovery handler.
 *
 * Supabase redirects users here after they click a confirmation or recovery
 * link in their email. Supports TWO exchange mechanisms:
 *
 * 1. **PKCE flow** (default with @supabase/ssr): URL has `?code=...`.
 *    We exchange the code for a session via `exchangeCodeForSession(code)`.
 *
 * 2. **Token hash flow** (custom email templates): URL has `?token_hash=...&type=...`.
 *    We exchange the hash via `verifyOtp({ token_hash, type })`.
 *
 * Both paths create an authenticated session. After exchange, the user is
 * redirected to the `?next=` param (sanitized) or a type-based fallback.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const rawNext = searchParams.get("next");

  // Default redirect targets per confirmation type
  const fallbackByType: Record<string, string> = {
    signup: "/admin",
    recovery: "/admin/reset-password",
    email_change: "/admin",
    magiclink: "/admin",
    invite: "/admin",
    email: "/admin",
  };

  const next = sanitizeNextUrl(
    rawNext ?? fallbackByType[type ?? "signup"] ?? "/admin",
  );

  const supabase = await createClient();

  // Path 1: PKCE code exchange (default @supabase/ssr flow)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid_link", request.url),
      );
    }
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Path 2: Token hash exchange (custom email template flow)
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(
        new URL("/admin/login?error=invalid_link", request.url),
      );
    }
    return NextResponse.redirect(new URL(next, request.url));
  }

  // Neither code nor token_hash — malformed link
  return NextResponse.redirect(
    new URL("/admin/login?error=invalid_link", request.url),
  );
}
