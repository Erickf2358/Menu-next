"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { closeTableSession } from "@/actions/table-session-actions";
import { useStore } from "@/src/store";
import { formatCurrency } from "@/src/utils";
import type { Order, OrderProducts, Product } from "@/src/generated/prisma/client";

type OrderWithProducts = Order & {
  orderProducts: (OrderProducts & { product: Product })[];
};

type TableSessionControlsProps = {
  tableNumber: number;
  orders: OrderWithProducts[];
};

export default function TableSessionControls({
  tableNumber,
  orders,
}: TableSessionControlsProps) {
  const router = useRouter();
  const clear = useStore((state) => state.clear);
  const [showOrders, setShowOrders] = useState(false);
  const [clearing, setClearing] = useState(false);

  const handleClear = async () => {
    setClearing(true);
    await closeTableSession();
    clear();
    router.refresh();
  };

  return (
    <div className="p-5 space-y-3 border-b border-gray-200">
      <p className="text-sm font-bold text-gray-500 uppercase">
        Mesa {tableNumber}
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowOrders(!showOrders)}
          className="flex-1 text-xs font-bold uppercase p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          Ver pedido actual
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={clearing}
          className="flex-1 text-xs font-bold uppercase p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
        >
          Limpiar pedido
        </button>
      </div>

      {showOrders && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {orders.length === 0 ? (
            <p className="text-sm text-gray-500">Aún no hay pedidos enviados</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white shadow p-3 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-sm">{order.name}</p>
                  <span
                    className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
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
                    <li key={item.id} className="flex justify-between text-xs">
                      <span>
                        {item.quantity} &times; {item.product.name}
                      </span>
                      <span className="text-gray-600">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-black text-right">
                  Total: {formatCurrency(order.total)}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
