"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "@/actions/product-actions";
import { notifyError, notifySuccess } from "@/components/ui/ToastNotification";

type DeleteProductButtonProps = {
  productId: number;
};

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) {
      return;
    }

    setDeleting(true);
    const result = await deleteProduct(productId);
    setDeleting(false);

    if (result.error) {
      notifyError(result.error);
      return;
    }

    notifySuccess("Producto eliminado correctamente");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="flex-1 flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 font-bold uppercase text-sm px-3 py-2 rounded-lg cursor-pointer"
    >
      <TrashIcon className="h-4 w-4" />
      Eliminar
    </button>
  );
}
