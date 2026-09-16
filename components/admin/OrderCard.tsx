"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "@/src/utils";
import { updateOrderStatus } from "@/actions/update-order-status-action";
import type { Order, OrderProducts, Product } from "@/src/generated/prisma/client";

type OrderWithProducts = Order & {
  orderProducts: (OrderProducts & { product: Product })[];
};

type OrderCardProps = {
  order: OrderWithProducts;
};

export default function OrderCard({ order }: OrderCardProps) {
  const [updating, setUpdating] = useState(false);

  const handleComplete = async () => {
    setUpdating(true);
    await updateOrderStatus(order.id, !order.status);
    setUpdating(false);
  };

  return (
    <div className="shadow-md bg-white p-5 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xl font-black">{order.name}</p>
        <span
          className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
            order.status
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {order.status ? "Completado" : "Pendiente"}
        </span>
      </div>

      <ul className="space-y-1">
        {order.orderProducts.map((item) => (
          <li key={item.id} className="flex justify-between text-sm">
            <span>
              {item.quantity} &times; {item.product.name}
            </span>
            <span className="text-gray-600">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <p className="text-lg font-black text-right">
        Total: {formatCurrency(order.total)}
      </p>

      <button
        type="button"
        onClick={handleComplete}
        disabled={updating}
        className={`w-full flex items-center justify-center gap-2 p-2 rounded-lg font-bold uppercase text-sm disabled:opacity-50 ${
          order.status
            ? "bg-gray-100 text-gray-600"
            : "bg-indigo-600 text-white hover:bg-indigo-800"
        }`}
      >
        <CheckCircleIcon className="h-5 w-5" />
        {order.status ? "Marcar como pendiente" : "Marcar como completado"}
      </button>
    </div>
  );
}
