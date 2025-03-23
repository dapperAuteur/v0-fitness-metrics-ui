"use client"

import type React from "react"

import { useState, useEffect } from "react"

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  // For server-side rendering compatibility
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const toast = (props: ToastProps) => {
    // For server-side rendering, just log to console
    if (!isMounted) {
      console.log(`Toast: ${props.title} - ${props.description}`)
      return
    }

    const id = props.id || String(Date.now())

    // Add toast to state
    setToasts((prevToasts) => [...prevToasts, { ...props, id }])

    // Remove toast after 5 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 5000)

    return id
  }

  const dismiss = (toastId?: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId))
  }

  return { toast, dismiss, toasts }
}

