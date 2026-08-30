"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        className: "nb-toast",
        duration: 5000,
      }}
      richColors={false}
      closeButton={false}
    />
  );
}
