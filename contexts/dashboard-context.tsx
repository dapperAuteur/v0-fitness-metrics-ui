"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type DashboardView = "goals" | "timeline" | "wheel"

interface DashboardContextType {
  view: DashboardView
  setView: (view: DashboardView) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<DashboardView>("goals")

  // Load preference from localStorage on mount
  useEffect(() => {
    const savedView = localStorage.getItem("dashboardView") as DashboardView
    if (savedView && ["goals", "timeline", "wheel"].includes(savedView)) {
      setView(savedView)
    }
  }, [])

  // Save preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("dashboardView", view)
  }, [view])

  return <DashboardContext.Provider value={{ view, setView }}>{children}</DashboardContext.Provider>
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

