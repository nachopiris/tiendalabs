import type { User } from "@supabase/auth-js";

/**
 * Domain alias for the Supabase Auth user shape.
 * Import this throughout the app instead of the raw Supabase type.
 */
export type AuthUser = User;

/**
 * Shape returned by all Server Actions in the admin panel.
 * `error` is null on success; a Spanish message string on failure.
 */
export type ActionState = {
  error: string | null;
};

/** Convenience constant for initialising useActionState. */
export const INITIAL_ACTION_STATE: ActionState = { error: null };
