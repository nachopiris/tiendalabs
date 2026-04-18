import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, _cacheHeaders) {
          // NOTE: _cacheHeaders cannot be applied here — Server Components cannot
          // mutate response headers in Next.js. The proxy applies cacheHeaders on
          // the outgoing response for authenticated requests. See src/proxy.ts.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component (read-only context) — safely ignore.
            // The proxy has already refreshed the session via getClaims() before
            // the request reaches any Server Component.
          }
        },
      },
    },
  );
}
