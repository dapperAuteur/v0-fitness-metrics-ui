"use client"

import { useDashboard } from "@/contexts/dashboard-context"
import GoalDashboard from "@/components/goal-dashboard"
import TimelineDashboard from "@/components/timeline-dashboard"
import WheelDashboard from "@/components/wheel-dashboard"

export default function DashboardSwitcher() {
  const { view } = useDashboard()

  switch (view) {
    case "goals":
      return <GoalDashboard />
    case "timeline":
      return <TimelineDashboard />
    case "wheel":
      return <WheelDashboard />
    default:
      return <GoalDashboard />
  }
}

