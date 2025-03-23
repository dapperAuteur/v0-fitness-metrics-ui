"use client"

import { Sparkles, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import DashboardToggle from "@/components/dashboard-toggle"
import { useDashboard } from "@/contexts/dashboard-context"

interface DashboardHeaderProps {
  className?: string
}

export default function DashboardHeader({ className }: DashboardHeaderProps) {
  const router = useRouter()
  const { view } = useDashboard()

  const getTitle = () => {
    switch (view) {
      case "goals":
        return "Goal-Centered Dashboard"
      case "timeline":
        return "Daily Story Timeline"
      case "wheel":
        return "Holistic Wellness Wheel"
      default:
        return "Dashboard"
    }
  }

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-6 ${className}`}
    >
      <Button
        variant="ghost"
        className="flex items-center gap-2 p-0 hover:bg-transparent"
        onClick={() => router.push("/")}
      >
        <Sparkles className="h-5 w-5 text-blue-500" />
        <span className="font-bold">World's Fastest Centenarian</span>
      </Button>

      <div className="absolute left-1/2 transform -translate-x-1/2 font-semibold hidden md:block">{getTitle()}</div>

      <div className="flex items-center gap-2">
        <DashboardToggle />
        <Button variant="ghost" size="icon" className="rounded-full">
          <User className="h-5 w-5" />
          <span className="sr-only">User profile</span>
        </Button>
      </div>
    </header>
  )
}

