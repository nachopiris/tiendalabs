// Phase 2 (add-admin-auth): two changes from the original proxy:
//
// 1. Session refresh via Supabase SSR on every request.
//    createServerClient is bound to the request/response cookie store;
//    getClaims() triggers a silent JWT refresh when the access token is near
//    expiry. cacheHeaders returned by Supabase (e.g. Cache-Control: private,
//    no-store) are applied to the response so CDNs never cache auth responses.
//
// 2. x-store-slug injection is SKIPPED for /admin/* and /auth/* paths.
//    Admin panel lives on the main domain, not a tenant subdomain. /auth/confirm
//    is the email-confirmation route handler — also not a storefront tenant.
//    All other paths continue to receive the slug header as before.

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/types";

/**
 * Multi-tenant proxy that:
 *   1. Refreshes the Supabase session JWT on every request via getClaims().
 *   2. Resolves which store to render from the hostname (subdomain), but
 *      skips that logic for /admin/* and /auth/* paths.
 *
 * Examples:
 *   tuproducto.tiendalabs.com → store slug = "tuproducto"
 *   localhost:3000             → uses ?store= query param or x-store-slug header, defaults to demo
 *   localhost:3000/admin       → no x-store-slug (admin panel, not a tenant)
 */
export async function proxy(request: NextRequest) {
  // 1. Start with a mutable response that forwards request headers downstream.
  //    requestHeaders is the base — we may add x-store-slug to it for storefront paths.
  const requestHeaders = new Headers(request.headers);
  // Expose the current pathname to downstream Server Components (layouts, pages).
  // Needed by the protected layout to build the ?next= param for login redirects
  // (so /admin/products redirects back to /admin/products after auth, not /admin).
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  let response = NextResponse.next({ request: { headers: requestHeaders } });

  // 2. Create a Supabase SSR client bound to this specific request/response pair.
  //    The cookies adapter gives Supabase full read/write access to the cookies:
  //      - getAll() reads from the incoming request (already includes any refresh tokens)
  //      - setAll() writes to both the request (for downstream chaining) AND the new
  //        response object, then applies cacheHeaders to prevent CDN caching of
  //        authenticated responses (Cache-Control: private, no-store or equivalent).
  //
  //    IMPORTANT (Supabase SSR contract): do NOT do anything between createServerClient
  //    and the getClaims() call below. Cookies are only written during getClaims().
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, cacheHeaders) {
          // Write cookies onto the incoming request so that any subsequent
          // NextResponse.next() call (below, for storefront slug) inherits them.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Rebuild the response with the refreshed request cookies in scope.
          response = NextResponse.next({ request: { headers: requestHeaders } });
          // Write the cookies onto the new response so the browser receives them.
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          // Apply Supabase cache headers (e.g. Cache-Control: private, no-store).
          // This prevents CDNs from caching responses that carry a refreshed token.
          if (cacheHeaders) {
            for (const [key, value] of Object.entries(cacheHeaders)) {
              response.headers.set(key, value);
            }
          }
        },
      },
    },
  );

  // 3. Refresh the session JWT via local validation (no network call to auth server).
  //    If the access token is near expiry, Supabase SSR fetches a new one using the
  //    refresh token and writes updated cookies via the setAll callback above.
  //    If there is no session or the refresh token is expired, no cookies are written
  //    and the request continues unmodified — the protected layout handles the redirect.
  await supabase.auth.getClaims();

  // 4. Multi-tenant slug logic — SKIP for /admin/* and /auth/* paths.
  //    Admin panel is on the main domain (no subdomain → no tenant).
  //    /auth/confirm is the PKCE token-exchange route, also not a storefront tenant.
  const pathname = request.nextUrl.pathname;
  const isAdminOrAuth =
    pathname.startsWith("/admin") || pathname.startsWith("/auth");

  if (!isAdminOrAuth) {
    // Existing storefront logic: extract slug and inject x-store-slug header.
    const hostname = request.headers.get("host") ?? "localhost:3000";
    const url = request.nextUrl.clone();
    let storeSlug: string | null = null;

    if (
      hostname.includes("localhost") ||
      hostname.includes("127.0.0.1")
    ) {
      // Dev: check query param first, then header, then default to "demo"
      storeSlug =
        url.searchParams.get("store") ??
        request.headers.get("x-store-slug") ??
        "demo";
    } else {
      // Production: extract subdomain from hostname
      // hostname = "tuproducto.tiendalabs.com"
      const parts = hostname.split(".");
      if (parts.length >= 3) {
        storeSlug = parts[0];
      }
    }

    if (storeSlug) {
      // Set the slug on requestHeaders and rebuild the response so it carries the
      // updated request header downstream.
      //
      // Cookie preservation: by the time we reach here, any session cookies written
      // by setAll() above are already reflected in request.cookies (step 2). The
      // rebuilt NextResponse.next() inherits them because setAll() also set them on
      // the request object. We then re-apply the session cookies from request.cookies
      // onto the new response so the browser still receives the Set-Cookie headers.
      requestHeaders.set("x-store-slug", storeSlug);
      const storefrontResponse = NextResponse.next({
        request: { headers: requestHeaders },
      });

      // Copy over any cookies the SSR session refresh may have written.
      response.cookies.getAll().forEach(({ name, value, ...rest }) =>
        storefrontResponse.cookies.set(name, value, rest),
      );

      // Copy over any cache headers set by Supabase during the refresh.
      response.headers.forEach((value, key) => {
        // Only propagate headers set by Supabase (not the default Next.js ones).
        if (key.toLowerCase() === "cache-control") {
          storefrontResponse.headers.set(key, value);
        }
      });

      return storefrontResponse;
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
