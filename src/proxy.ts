import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Multi-tenant proxy that resolves which store to render
 * based on the hostname (subdomain).
 *
 * Examples:
 *   tuproducto.tiendalabs.com → store slug = "tuproducto"
 *   localhost:3000             → uses x-store-slug header or defaults to demo
 */
export function proxy(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "localhost:3000";
  const url = request.nextUrl.clone();

  // In development, allow overriding the store via header or query param
  let storeSlug: string | null = null;

  if (
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1")
  ) {
    // Dev: check query param first, then header, then default
    storeSlug =
      url.searchParams.get("store") ??
      request.headers.get("x-store-slug") ??
      "demo";
  } else {
    // Production: extract subdomain
    // hostname = "tuproducto.tiendalabs.com"
    const parts = hostname.split(".");
    if (parts.length >= 3) {
      storeSlug = parts[0];
    }
  }

  if (!storeSlug) {
    // No store resolved — could be the main marketing site
    return NextResponse.next();
  }

  // Pass the store slug downstream via request headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-store-slug", storeSlug);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
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
