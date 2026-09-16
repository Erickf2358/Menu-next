"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product-actions";
import { notifyError, notifySuccess } from "@/components/ui/ToastNotification";
import type { Category, Product } from "@/src/generated/prisma/client";

type ProductFormProps = {
  categories: Category[];
  product?: Product;
};

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);

    const data = {
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      image: formData.get("image") as string,
      categoryId: Number(formData.get("categoryId")),
    };

    const result = product
      ? await updateProduct(product.id, data)
      : await createProduct(data);

    setSubmitting(false);

    if (result.error) {
      notifyError(result.error);
      return;
    }

    notifySuccess(
      product ? "Producto actualizado correctamente" : "Producto creado correctamente"
    );
    router.push("/admin/products");
  };

  return (
    <form
      action={handleSubmit}
      className="mt-10 bg-white shadow-md rounded-lg p-6 space-y-5 max-w-lg"
    >
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-bold uppercase text-gray-600">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={product?.name}
          className="border border-gray-200 rounded-lg p-3 w-full"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="price" className="text-sm font-bold uppercase text-gray-600">
          Precio
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price}
          className="border border-gray-200 rounded-lg p-3 w-full"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="image" className="text-sm font-bold uppercase text-gray-600">
          Imagen
        </label>
        <input
          id="image"
          name="image"
          type="text"
          placeholder="ej. pizza"
          defaultValue={product?.image}
          className="border border-gray-200 rounded-lg p-3 w-full"
        />
        <p className="text-xs text-gray-400">
          Nombre del archivo (sin extensión) ya existente en public/products, ej.
          &quot;pizza&quot; para pizza.jpg
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="categoryId" className="text-sm font-bold uppercase text-gray-600">
          Categoría
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          className="border border-gray-200 rounded-lg p-3 w-full"
        >
          <option value="">-- Selecciona --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-indigo-600 hover:bg-indigo-800 disabled:opacity-50 text-white font-bold uppercase p-3 rounded-lg cursor-pointer"
      >
        {submitting ? "Guardando..." : product ? "Guardar cambios" : "Crear producto"}
      </button>
    </form>
  );
}
