"use client";

export function Newsletter() {
  return (
    <section className="bg-brand-primary py-16 text-brand-primary-foreground">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <h2 className="text-2xl font-bold md:text-3xl">
          Suscribite y obtené un 10% OFF
        </h2>
        <p className="mt-3 opacity-80">
          Recibí ofertas exclusivas, lanzamientos y novedades antes que nadie.
        </p>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Tu email"
            className="flex-1 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm text-brand-primary-foreground placeholder-white/50 outline-none transition-colors focus:border-white/40 focus:ring-1 focus:ring-white/40"
            required
          />
          <button
            type="submit"
            className="rounded-xl bg-brand-primary-foreground px-8 py-3.5 text-sm font-semibold text-brand-primary transition-opacity hover:opacity-90"
          >
            Suscribirme
          </button>
        </form>

        <p className="mt-4 text-xs opacity-60">
          No spam. Podés darte de baja en cualquier momento.
        </p>
      </div>
    </section>
  );
}
