"use client"

import type React from "react"

import { useState } from "react"
import {
  Activity,
  BarChart3,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Moon,
  Sparkles,
  Trophy,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CircularProgress } from "@/components/circular-progress"
import DashboardHeader from "@/components/dashboard-header"

export default function GoalDashboard() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const insights = [
    {
      title: "Small Win: Completed morning stretch routine",
      description: "You've maintained this habit for 7 days in a row!",
      icon: Trophy,
      color: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      title: "Insight: Your recognition practice led to 15% better recovery",
      description: "Celebrating small wins is improving your sleep quality.",
      icon: Sparkles,
      color: "bg-purple-500/20",
      iconColor: "text-purple-400",
    },
    {
      title: "Pattern: You sleep better on days with 8000+ steps",
      description: "Consider a short evening walk to improve sleep quality.",
      icon: Activity,
      color: "bg-indigo-500/20",
      iconColor: "text-indigo-400",
    },
  ]

  const totalSlides = insights.length

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6 space-y-8">
          {/* Personal Goals */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Personal Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GoalCard
                title="Improve Sleep Quality"
                progress={65}
                subtitle="7 days remaining"
                color="from-blue-600 to-blue-400"
              />
              <GoalCard
                title="10,000 Daily Steps"
                progress={78}
                subtitle="On track"
                color="from-purple-600 to-purple-400"
              />
              <GoalCard
                title="Celebrate Daily Wins"
                progress={50}
                subtitle="2 today"
                color="from-indigo-600 to-indigo-400"
              />
            </div>
          </section>

          {/* Today's Focus */}
          <section>
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-blue-500/20">
                    <Moon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Focus on Recovery Today</h3>
                    <p className="text-muted-foreground">
                      Your sleep quality was below average last night. Consider gentle activity and mindfulness.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Wins & Insights */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Wins & Insights</h2>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={prevSlide}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={nextSlide}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next</span>
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {insights.map((insight, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-1">
                    <Card className={cn("border-slate-700", insight.color)}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={cn("rounded-full p-2", insight.color)}>
                            <insight.icon className={cn("h-5 w-5", insight.iconColor)} />
                          </div>
                          <div>
                            <h3 className="font-medium mb-1">{insight.title}</h3>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-4 gap-1">
                {insights.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      index === currentSlide ? "w-6 bg-primary" : "w-1.5 bg-muted",
                    )}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Quick Add */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Quick Add</h2>
            <div className="grid grid-cols-2 gap-4">
              <QuickAddButton
                icon={<Dumbbell className="h-6 w-6" />}
                label="Log Activity"
                onClick={() => router.push("/steps")}
              />
              <QuickAddButton
                icon={<Moon className="h-6 w-6" />}
                label="Track Sleep"
                onClick={() => router.push("/sleep")}
              />
              <QuickAddButton
                icon={<Trophy className="h-6 w-6" />}
                label="Record Win"
                onClick={() => router.push("/small-wins")}
              />
              <QuickAddButton
                icon={<Activity className="h-6 w-6" />}
                label="Log Metrics"
                onClick={() => router.push("/heart-rate")}
              />
            </div>
          </section>

          {/* Navigation Footer */}
          <section className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="default"
                size="lg"
                className="h-auto py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                onClick={() => router.push("/dashboard")}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-semibold">Metrics Dashboard</span>
                  </div>
                  <span className="text-xs mt-1 text-blue-200">View detailed metrics</span>
                </div>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="h-auto py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600"
                onClick={() => router.push("/adaptation-calculator")}
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    <span className="font-semibold">Adaptation Response Calculator</span>
                  </div>
                  <span className="text-xs mt-1 text-purple-200">Check your adaptation correlation</span>
                </div>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

interface GoalCardProps {
  title: string
  progress: number
  subtitle: string
  color: string
}

function GoalCard({ title, progress, subtitle, color }: GoalCardProps) {
  return (
    <Card className="border-slate-700">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <CircularProgress
            value={progress}
            size={100}
            strokeWidth={8}
            bgStrokeWidth={8}
            progressClassName={`stroke-gradient ${color}`}
            bgClassName="stroke-slate-700"
            textClassName="text-lg font-bold"
          />
          <h3 className="font-semibold mt-4">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

interface QuickAddButtonProps {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}

function QuickAddButton({ icon, label, onClick }: QuickAddButtonProps) {
  return (
    <Button
      variant="outline"
      className="h-auto py-6 border-slate-700 hover:bg-slate-800 hover:text-primary-foreground"
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="rounded-full p-2 bg-primary/10">{icon}</div>
        <span>{label}</span>
      </div>
    </Button>
  )
}

