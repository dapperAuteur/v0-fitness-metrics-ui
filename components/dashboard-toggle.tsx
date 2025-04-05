"use client"

import { LayoutDashboard, Clock, PieChart } from "lucide-react"
import { useDashboard } from "@/contexts/dashboard-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function DashboardToggle() {
  const { view, setView } = useDashboard()

  const getIcon = () => {
    switch (view) {
      case "goals":
        return <LayoutDashboard className="h-5 w-5" />
      case "timeline":
        return <Clock className="h-5 w-5" />
      case "wheel":
        return <PieChart className="h-5 w-5" />
      default:
        return <LayoutDashboard className="h-5 w-5" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          {getIcon()}
          <span className="sr-only">Switch dashboard view</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setView("goals")}>
          <LayoutDashboard className="mr-2 h-4 w-4" />
          <span>Goal-Centered Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setView("timeline")}>
          <Clock className="mr-2 h-4 w-4" />
          <span>Daily Story Timeline</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setView("wheel")}>
          <PieChart className="mr-2 h-4 w-4" />
          <span>Holistic Wellness Wheel</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

