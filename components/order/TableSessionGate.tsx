"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startOrResumeTableSession } from "@/actions/table-session-actions";
import { notifyError } from "@/components/ui/ToastNotification";
import Logo from "@/components/ui/Logo";

export default function TableSessionGate() {
  const router = useRouter();
  const [tableNumber, setTableNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await startOrResumeTableSession(Number(tableNumber));

    if (result?.error) {
      notifyError(result.error);
      setSubmitting(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <div className="w-full max-w-sm space-y-6 text-center">
        <Logo />
        <h1 className="text-2xl font-black">Ingresa tu número de mesa</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="number"
            min={1}
            max={10}
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Número de mesa (1-10)"
            required
            className="w-full p-3 border border-gray-300 rounded-lg text-center text-xl"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-indigo-600 hover:bg-indigo-800 disabled:opacity-50 text-white p-3 uppercase font-bold rounded-lg"
          >
            {submitting ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
