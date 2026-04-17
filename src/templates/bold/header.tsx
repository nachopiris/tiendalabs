import type { Store } from "@/lib/supabase/types";

interface HeaderProps {
  store: Store;
}

export function Header({ store }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          {store.branding.logo_url ? (
            <img
              src={store.branding.logo_url}
              alt={store.name}
              className="h-8 w-auto"
            />
          ) : (
            <span className="text-xl font-bold tracking-tight text-brand-foreground">
              {store.name}
            </span>
          )}
        </a>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-foreground"
          >
            Inicio
          </a>
          <a
            href="#productos"
            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-foreground"
          >
            Productos
          </a>
        </nav>

        {/* Cart */}
        <a
          href="/cart"
          className="relative flex items-center gap-2 rounded-full border border-brand-border px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-surface"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <span className="hidden sm:inline">Carrito</span>
        </a>
      </div>
    </header>
  );
}
