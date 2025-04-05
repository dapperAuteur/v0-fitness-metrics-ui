"use client"

import type React from "react"

import { format } from "date-fns"
import { Activity, BarChart3, Calculator, Heart, Moon, Plus, Sun, Sunset, Trophy, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import DashboardHeader from "@/components/dashboard-header"

export default function TimelineDashboard() {
  const router = useRouter()
  const currentDate = new Date("2025-03-22")

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <DashboardHeader />

      {/* Date display */}
      <div className="container mx-auto px-4 md:px-6 pt-4">
        <p className="text-sm text-muted-foreground">{format(currentDate, "MMMM d, yyyy")}</p>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-4 md:p-6">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-purple-600 to-indigo-600 transform -translate-x-1/2" />

            {/* Morning section */}
            <TimelineSection
              title="Morning"
              subtitle="6am-12pm"
              icon={<Sun className="h-5 w-5" />}
              iconBg="bg-amber-500/20"
              iconColor="text-amber-400"
            >
              <TimelineCard
                side="left"
                title="You slept well last night"
                description="Your sleep quality was excellent"
                metric="90/100"
                metricLabel="Sleep Score"
                secondaryMetric="6.8 hrs"
                secondaryMetricLabel="Duration"
                icon={<Moon className="h-5 w-5" />}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
              />

              <TimelineCard
                side="right"
                title="Your morning heart rate was calm today"
                description="Your resting heart rate is lower than average"
                metric="61 bpm"
                metricLabel="Resting Heart Rate"
                icon={<Heart className="h-5 w-5" />}
                iconBg="bg-red-500/20"
                iconColor="text-red-400"
              />
            </TimelineSection>

            {/* Afternoon section */}
            <TimelineSection
              title="Afternoon"
              subtitle="12pm-6pm"
              icon={<Sun className="h-5 w-5" />}
              iconBg="bg-orange-500/20"
              iconColor="text-orange-400"
            >
              <TimelineCard
                side="left"
                title="Active lunch break"
                description="You took a walk during your lunch break"
                metric="2,500 steps"
                metricLabel="Steps"
                badge="Great choice!"
                icon={<Activity className="h-5 w-5" />}
                iconBg="bg-green-500/20"
                iconColor="text-green-400"
              />

              <TimelineCard
                side="right"
                title="You celebrated completing a project"
                description="Taking time to recognize achievements"
                icon={<Trophy className="h-5 w-5" />}
                iconBg="bg-amber-500/20"
                iconColor="text-amber-400"
              />

              {/* Correlation indicator */}
              <div className="relative mt-4 mb-8">
                <div className="absolute left-1/2 w-1/3 h-0.5 bg-purple-500/50 transform -translate-x-1/2 translate-y-6" />
                <TimelineCard
                  side="left"
                  special={true}
                  title="Recovery score improved by 8%"
                  description="Celebrating achievements correlates with better recovery"
                  icon={<TrendingUp className="h-5 w-5" />}
                  iconBg="bg-purple-500/20"
                  iconColor="text-purple-400"
                />
              </div>
            </TimelineSection>

            {/* Evening section */}
            <TimelineSection
              title="Evening"
              subtitle="6pm-10pm"
              icon={<Sunset className="h-5 w-5" />}
              iconBg="bg-pink-500/20"
              iconColor="text-pink-400"
            >
              <TimelineCard
                side="right"
                title="Evening walk"
                description="You added more steps in the evening"
                metric="3,000 steps"
                metricLabel="Additional Steps"
                badge="Building consistency!"
                icon={<Activity className="h-5 w-5" />}
                iconBg="bg-green-500/20"
                iconColor="text-green-400"
              />

              {/* Pattern highlight */}
              <div className="relative mt-4 mb-8">
                <TimelineCard
                  side="left"
                  special={true}
                  title="Pattern detected"
                  description="Your evening activity correlates with better morning heart rate"
                  icon={<TrendingUp className="h-5 w-5" />}
                  iconBg="bg-indigo-500/20"
                  iconColor="text-indigo-400"
                />
              </div>
            </TimelineSection>

            {/* Night section */}
            <TimelineSection
              title="Night"
              subtitle="10pm-6am"
              icon={<Moon className="h-5 w-5" />}
              iconBg="bg-indigo-500/20"
              iconColor="text-indigo-400"
            >
              {/* Prediction card */}
              <TimelineCard
                side="right"
                special={true}
                title="Sleep better tonight"
                description="Based on today's activity, a 10-minute stretch session might help you sleep better tonight"
                icon={<Moon className="h-5 w-5" />}
                iconBg="bg-blue-500/20"
                iconColor="text-blue-400"
                action={
                  <Button size="sm" variant="outline" className="mt-2">
                    Set reminder
                  </Button>
                }
              />
            </TimelineSection>
          </div>

          {/* Navigation Footer */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="default"
              size="lg"
              className="h-auto py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              onClick={() => router.push("/dashboard")}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <span className="font-semibold">Switch to Metrics Dashboard</span>
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
                <span className="font-semibold">Open Adaptation Response Calculator</span>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {/* Floating add button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Add entry</span>
      </Button>
    </div>
  )
}

interface TimelineSectionProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  children: React.ReactNode
}

function TimelineSection({ title, subtitle, icon, iconBg, iconColor, children }: TimelineSectionProps) {
  return (
    <div className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-center mb-6">
        <div className={cn("rounded-full p-2 z-10", iconBg)}>
          <div className={cn("rounded-full p-2 bg-background", iconBg)}>
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Timeline content */}
      <div className="space-y-6">{children}</div>
    </div>
  )
}

interface TimelineCardProps {
  side: "left" | "right"
  title: string
  description: string
  metric?: string
  metricLabel?: string
  secondaryMetric?: string
  secondaryMetricLabel?: string
  badge?: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  special?: boolean
  action?: React.ReactNode
}

function TimelineCard({
  side,
  title,
  description,
  metric,
  metricLabel,
  secondaryMetric,
  secondaryMetricLabel,
  badge,
  icon,
  iconBg,
  iconColor,
  special = false,
  action,
}: TimelineCardProps) {
  return (
    <div
      className={cn(
        "relative flex",
        side === "left" ? "justify-end md:pr-8" : "justify-start md:pl-8",
        "md:w-1/2 md:self-start",
        side === "left" ? "md:mr-auto" : "md:ml-auto",
      )}
    >
      {/* Timeline dot */}
      <div className="absolute top-4 left-1/2 w-3 h-3 rounded-full bg-primary transform -translate-x-1/2 z-10" />

      {/* Card */}
      <Card
        className={cn(
          "w-full md:max-w-md border-slate-700",
          special && "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-600",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn("rounded-full p-2 flex-shrink-0", iconBg)}>
              <div className={iconColor}>{icon}</div>
            </div>

            <div className="flex-1">
              <h3 className="font-medium mb-1">{title}</h3>
              <p className="text-sm text-muted-foreground mb-2">{description}</p>

              {(metric || secondaryMetric) && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {metric && (
                    <div>
                      <div className="text-lg font-semibold">{metric}</div>
                      {metricLabel && <div className="text-xs text-muted-foreground">{metricLabel}</div>}
                    </div>
                  )}

                  {secondaryMetric && (
                    <div>
                      <div className="text-lg font-semibold">{secondaryMetric}</div>
                      {secondaryMetricLabel && (
                        <div className="text-xs text-muted-foreground">{secondaryMetricLabel}</div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {badge && (
                <div className="mt-2">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                    {badge}
                  </span>
                </div>
              )}

              {action}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

