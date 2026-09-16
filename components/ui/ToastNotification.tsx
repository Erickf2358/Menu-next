"use client";

import { Toaster, toast } from "sonner";

export default function ToastNotification() {
  return <Toaster position="top-center" richColors closeButton />;
}

export const notifySuccess = (message: string) => toast.success(message);
export const notifyError = (message: string) => toast.error(message);
