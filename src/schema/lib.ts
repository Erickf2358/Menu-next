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

export const ProductSchema = z.object({
  name: z.string().trim().min(1, "El nombre es obligatorio"),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  image: z.string().trim().min(1, "La imagen es obligatoria"),
  categoryId: z.coerce.number().int().positive("Selecciona una categoría"),
});

export const TableSessionSchema = z.object({
  tableNumber: z
    .coerce
    .number()
    .int()
    .min(1, "El número de mesa debe estar entre 1 y 10")
    .max(10, "El número de mesa debe estar entre 1 y 10"),
});