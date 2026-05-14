import { z } from "zod";

export const productVariantSchema = z.object({
  name: z.string().min(1, "El nombre de la variante no puede estar vacío"),
  options: z
    .array(z.string().min(1, "Las opciones no pueden estar vacías"))
    .min(1, "Cada variante necesita al menos una opción"),
});

export const productVariantsSchema = z.array(productVariantSchema);

/**
 * Validates a nullable price field coming from FormData.
 * Empty string or null → null. A numeric string → number (must be >= 0).
 */
const nullablePrice = z.preprocess(
  (val) => {
    if (val === "" || val === null || val === undefined) return null;
    const n = Number(val);
    return isNaN(n) ? val : n;
  },
  z.number("El precio comparativo debe ser un número").min(0, "El precio comparativo no puede ser negativo").nullable(),
);

export const productFormSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre del producto es obligatorio"),
    slug: z
      .string()
      .regex(
        /^[a-z0-9-]+$/,
        "El slug solo puede tener letras minúsculas, números y guiones",
      ),
    description: z.string().trim(),
    price: z.coerce
      .number("El precio debe ser un número")
      .min(0, "El precio no puede ser negativo"),
    compare_at_price: nullablePrice,
    images: z
      .array(z.string().url("URL de imagen inválida"))
      .max(8, "No se pueden agregar más de 8 imágenes"),
    variants: productVariantsSchema,
    is_active: z.boolean(),
  })
  .refine(
    (d) => d.compare_at_price === null || d.compare_at_price > d.price,
    {
      message: "El precio comparativo debe ser mayor al precio actual",
      path: ["compare_at_price"],
    },
  );

export type ProductFormValues = z.infer<typeof productFormSchema>;
