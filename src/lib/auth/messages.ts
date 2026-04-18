/**
 * Rioplatense Spanish error dictionary for Supabase Auth error messages.
 * All user-facing copy lives here — forms and pages import from this module.
 */
export const AUTH_ERRORS: Record<string, string> = {
  "Invalid login credentials":
    "El email o la contraseña son incorrectos.",
  "Email not confirmed":
    "Confirmá tu email antes de entrar.",
  "User already registered":
    "Ya hay una cuenta con ese email.",
  "Password should be at least 6 characters":
    "La contraseña debe tener al menos 6 caracteres.",
  "Email rate limit exceeded":
    "Se enviaron muchos emails a esta dirección. Esperá un rato.",
  "Signup requires a valid password":
    "Ingresá una contraseña válida.",
  "Invalid Refresh Token":
    "La sesión expiró. Entrá de nuevo.",
  "Token has expired or is invalid":
    "El link expiró. Pedí uno nuevo.",
  // Supabase rate-limit code (returned in error.code sometimes)
  "over_email_send_rate_limit":
    "Se enviaron muchos emails a esta dirección. Esperá un rato.",
  // Rate-limit code returned in error.code for login/signup throttling
  "too_many_requests":
    "Demasiados intentos. Probá de nuevo en un rato.",
  // Partial-match key for rate-limit prose messages
  "For security purposes, you can only request this after":
    "Demasiados intentos. Probá de nuevo en un rato.",
};

/** Fallback shown when no specific mapping is found. */
const FALLBACK_ERROR = "Hubo un error. Probá de nuevo.";

/**
 * Maps a Supabase (or generic) error to a Rioplatense Spanish string.
 * Checks for an exact match first, then partial matches, then falls back.
 */
export function translateAuthError(
  error: { message?: string; code?: string } | Error | null | undefined,
): string {
  if (!error) return FALLBACK_ERROR;

  const msg = (error as { message?: string }).message ?? "";
  const code = (error as { code?: string }).code ?? "";

  // Exact match on message
  if (AUTH_ERRORS[msg]) return AUTH_ERRORS[msg];

  // Exact match on error code (e.g. "too_many_requests")
  if (code && AUTH_ERRORS[code]) return AUTH_ERRORS[code];

  // Partial match on message (e.g. rate-limit prose varies across Supabase versions)
  for (const [key, value] of Object.entries(AUTH_ERRORS)) {
    if (msg.includes(key)) return value;
  }

  return FALLBACK_ERROR;
}

// ─── Link error messages (for ?error= query params from /auth/confirm) ────────

/**
 * Maps error codes from URL query params to user-friendly Spanish messages.
 * Used by login/page.tsx to display a banner when /auth/confirm redirects
 * with ?error=invalid_link (expired, already-used, or malformed link).
 */
export const LINK_ERRORS: Record<string, string> = {
  invalid_link: "El link expiró o ya fue usado. Pedí uno nuevo.",
};

// ─── Common UI strings ────────────────────────────────────────────────────────

/** Shown after successful signup — instructs user to confirm their email. */
export const MSG_CONFIRM_EMAIL =
  "Revisá tu email para confirmar tu cuenta.";

/** Shown after forgot-password — instructs user to check their inbox. */
export const MSG_PASSWORD_RESET_SENT =
  "Te enviamos un email con las instrucciones.";
