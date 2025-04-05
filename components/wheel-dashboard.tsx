"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { Activity, BarChart3, Calculator, ChevronRight, Heart, Moon, Settings, Sparkles, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard-header"
import { cn } from "@/lib/utils"

export default function WheelDashboard() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          {/* Wellness Wheel */}
          <section className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Central circle */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 rounded-full bg-slate-800 border border-slate-700 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">78</span>
                  <span className="text-sm text-muted-foreground">Wellness Score</span>
                  <div className="absolute top-2 right-2 flex items-center justify-center bg-green-500/20 text-green-400 rounded-full px-1.5 py-0.5 text-xs font-medium">
                    +5
                  </div>
                </div>
              </div>

              {/* Wheel segments */}
              <WheelSegment
                name="Sleep"
                icon={<Moon className="h-5 w-5" />}
                color="bg-purple-500"
                percentage={80}
                rotation={0}
              />

              <WheelSegment
                name="Activity"
                icon={<Activity className="h-5 w-5" />}
                color="bg-green-500"
                percentage={70}
                rotation={90}
              />

              <WheelSegment
                name="Heart Health"
                icon={<Heart className="h-5 w-5" />}
                color="bg-blue-500"
                percentage={85}
                rotation={180}
              />

              <WheelSegment
                name="Small Wins"
                icon={<Trophy className="h-5 w-5" />}
                color="bg-amber-500"
                percentage={60}
                rotation={270}
              />
            </div>
          </section>

          {/* Balance Insights */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Balance Insights</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-blue-500/20 flex-shrink-0">
                      <Heart className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Heart Health & Recognition</h3>
                      <p className="text-sm text-muted-foreground">
                        Your heart health metrics are strong, but recognition practices need attention
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="h-1.5 w-8 rounded-full bg-blue-500"></div>
                        <div className="h-1.5 w-8 rounded-full bg-amber-500/40"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full p-2 bg-purple-500/20 flex-shrink-0">
                      <Moon className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Sleep Quality</h3>
                      <p className="text-sm text-muted-foreground">
                        Sleep quality is improving - continuing your evening routine is working
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="h-1.5 w-8 rounded-full bg-purple-500"></div>
                        <div className="h-1.5 w-8 rounded-full bg-green-500/60"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Adaptation Response */}
          <section>
            <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full p-2 bg-purple-500/20 flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Adaptation Response</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Recognition practices are influencing recovery positively
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-700">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-amber-500 to-purple-500"></div>
                      </div>
                      <span className="text-xs text-muted-foreground">75% correlation</span>
                    </div>

                    <Button
                      variant="link"
                      className="p-0 h-auto text-sm text-purple-400 flex items-center"
                      onClick={() => router.push("/adaptation-calculator")}
                    >
                      View Details
                      <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <QuickActionButton
                icon={<Moon className="h-5 w-5" />}
                label="Log Sleep"
                onClick={() => router.push("/sleep")}
              />
              <QuickActionButton
                icon={<Activity className="h-5 w-5" />}
                label="Track Activity"
                onClick={() => router.push("/steps")}
              />
              <QuickActionButton
                icon={<Trophy className="h-5 w-5" />}
                label="Record Win"
                onClick={() => router.push("/small-wins")}
              />
              <QuickActionButton
                icon={<Heart className="h-5 w-5" />}
                label="Check Heart Rate"
                onClick={() => router.push("/heart-rate")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="default"
                size="lg"
                className="h-auto py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                onClick={() => router.push("/dashboard")}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-semibold">View Detailed Metrics</span>
                </div>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="h-auto py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                onClick={() => router.push("/adaptation-calculator")}
              >
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  <span className="font-semibold">Open Adaptation Calculator</span>
                </div>
              </Button>
            </div>
          </section>
        </div>
      </main>

      {/* Settings button */}
      <Button variant="outline" size="icon" className="fixed bottom-6 right-6 h-12 w-12 rounded-full border-slate-700">
        <Settings className="h-5 w-5" />
        <span className="sr-only">Settings</span>
      </Button>

      {/* Homepage indicator */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
        <HomepageIndicator active={false} onClick={() => router.push("/?view=goals")} />
        <HomepageIndicator active={false} onClick={() => router.push("/?view=timeline")} />
        <HomepageIndicator active={true} onClick={() => router.push("/?view=wheel")} />
      </div>
    </div>
  )
}

interface WheelSegmentProps {
  name: string
  icon: React.ReactNode
  color: string
  percentage: number
  rotation: number
}

function WheelSegment({ name, icon, color, percentage, rotation }: WheelSegmentProps) {
  // Calculate the segment size based on percentage (0-100)
  const segmentSize = `${percentage}%`

  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ transform: `rotate(${rotation}deg)` }}>
      <div className="relative w-full h-full">
        {/* Segment background */}
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
          style={{
            transform: "rotate(45deg)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            background: `conic-gradient(${color}20 0deg, ${color}20 90deg, transparent 90deg, transparent 360deg)`,
          }}
        ></div>

        {/* Segment foreground */}
        <div
          className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
          style={{
            transform: "rotate(45deg)",
            clipPath: "polygon(0 0, 100% 0, 100% 100%)",
            background: `conic-gradient(${color} 0deg, ${color} 90deg, transparent 90deg, transparent 360deg)`,
            width: segmentSize,
            height: segmentSize,
          }}
        ></div>

        {/* Label */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            top: "25%",
            left: "75%",
            transform: `rotate(-${rotation}deg) translate(-50%, -50%)`,
          }}
        >
          <div className={`rounded-full p-1.5 ${color.replace("bg-", "bg-")}30`}>
            <div className={`${color.replace("bg-", "text-").replace("500", "400")}`}>{icon}</div>
          </div>
          <span className="text-xs font-medium mt-1 whitespace-nowrap" style={{ transform: `rotate(-${rotation}deg)` }}>
            {name}
          </span>
        </div>
      </div>
    </div>
  )
}

interface QuickActionButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

function QuickActionButton({ icon, label, onClick }: QuickActionButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-auto py-3 border-slate-700 hover:bg-slate-800 hover:text-primary-foreground"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full p-1.5 bg-primary/10">{icon}</div>
        <span className="text-xs">{label}</span>
      </div>
    </Button>
  )
}

interface HomepageIndicatorProps {
  active: boolean
  onClick?: () => void
}

function HomepageIndicator({ active, onClick }: HomepageIndicatorProps) {
  return (
    <button
      className={cn(
        "w-2 h-2 rounded-full transition-all",
        active ? "bg-primary w-6" : "bg-slate-600 hover:bg-slate-500",
      )}
      onClick={onClick}
    />
  )
}

