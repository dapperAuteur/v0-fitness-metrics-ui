"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardProvider, useDashboard } from "@/contexts/dashboard-context"
import DashboardSwitcher from "@/components/dashboard-switcher"

function DashboardWithParams() {
  const { setView } = useDashboard()
  const searchParams = useSearchParams()

  useEffect(() => {
    const viewParam = searchParams.get("view")
    if (viewParam && ["goals", "timeline", "wheel"].includes(viewParam)) {
      setView(viewParam as any)
    }
  }, [searchParams, setView])

  return <DashboardSwitcher />
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <DashboardProvider>
        <DashboardWithParams />
      </DashboardProvider>
    </main>
  )
}

