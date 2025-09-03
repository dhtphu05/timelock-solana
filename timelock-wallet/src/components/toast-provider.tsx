"use client"

import type React from "react"

import { useToast } from "../hooks/use-toast"

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts, dismiss } = useToast()

  return (
    <>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`glassmorphism p-4 rounded-lg shadow-lg max-w-sm ${
              toast.variant === "destructive" ? "border-red-500" : "border-green-500"
            }`}
          >
            {toast.title && <div className="font-semibold text-white">{toast.title}</div>}
            {toast.description && <div className="text-sm text-gray-300">{toast.description}</div>}
            <button onClick={() => dismiss(toast.id)} className="absolute top-2 right-2 text-gray-400 hover:text-white">
              ×
            </button>
          </div>
        ))}
      </div>
    </>
  )
}
