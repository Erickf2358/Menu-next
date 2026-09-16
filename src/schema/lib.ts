import { z } from "zod";

export const OrderSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
        price: z.number().positive(),
      })
    )
    .min(1, "Debe agregar al menos un producto"),
  total: z.number().positive("El total debe ser mayor a 0"),
});