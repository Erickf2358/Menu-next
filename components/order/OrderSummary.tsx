"use client";

import { useState } from "react";
import { useStore } from "@/src/store";
import { formatCurrency } from "@/src/utils";
import ProductDetails from "@/components/order/ProductDetails";
import { createOrder } from "@/actions/create-order-action";
import { notifyError, notifySuccess } from "@/components/ui/ToastNotification";

export default function OrderSummary() {
  const items = useStore((state) => state.items);
  const clear = useStore((state) => state.clear);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await createOrder(
      name,
      items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total
    );

    if (result?.error) {
      notifyError(result.error);
    } else {
      notifySuccess("Pedido confirmado correctamente");
      clear();
      setName("");
    }
    setSubmitting(false);
  };

  return (
    <aside className="md:h-screen md:overflow-y-scroll md:w-64 lg:w-96 p-5">
      <h1 className="text-4xl text-center font-black">Mi pedido</h1>

      {items.length === 0 ? (
        <p className="text-center mt-5 text-gray-500">Aún no hay productos</p>
      ) : (
        <>
          <ul className="mt-5 space-y-4">
            {items.map((item) => (
              <li key={item.product.id}>
                <ProductDetails item={item} />
              </li>
            ))}
          </ul>

          <p className="text-2xl font-black text-center mt-5">
            Total: {formatCurrency(total)}
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              required
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-800 disabled:opacity-50 text-white p-3 uppercase font-bold rounded-lg"
            >
              {submitting ? "Confirmando..." : "Confirmar pedido"}
            </button>
          </form>
        </>
      )}
    </aside>
  );
}