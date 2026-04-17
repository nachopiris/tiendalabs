import type { StoreTestimonial } from "@/lib/supabase/types";

interface TestimonialsProps {
  testimonials: StoreTestimonial[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={`star-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < rating ? 0 : 1.5}
          className={`h-4 w-4 ${i < rating ? "text-brand-accent" : "text-brand-border"}`}
        >
          <path
            fillRule="evenodd"
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
            clipRule="evenodd"
          />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-brand-surface py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-brand-foreground md:text-3xl">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-2 text-brand-muted">
            Opiniones reales de compradores verificados
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="flex flex-col gap-4 rounded-2xl border border-brand-border bg-brand-background p-6"
            >
              <StarRating rating={testimonial.rating} />
              <p className="flex-1 text-sm leading-relaxed text-brand-foreground">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-surface text-sm font-semibold text-brand-foreground">
                  {testimonial.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-brand-muted">
                    Comprador verificado
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
