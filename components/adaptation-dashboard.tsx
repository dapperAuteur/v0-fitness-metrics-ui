"use client"

import type React from "react"

import { useState } from "react"
import {
  ChevronDown,
  Dumbbell,
  FileBarChart,
  Heart,
  Home,
  Menu,
  Settings,
  Sparkles,
  TrendingUp,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { CorrelationChart } from "@/components/correlation-chart"
import { TrainingDurationChart } from "@/components/training-duration-chart"
import { TrainingIntensityHeatmap } from "@/components/training-intensity-heatmap"
import { ExerciseFrequencyChart } from "@/components/exercise-frequency-chart"
import { TrainingTypesChart } from "@/components/training-types-chart"
import { CorrelationAnalysis } from "@/components/correlation-analysis"

export default function AdaptationDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(true)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h1 className="text-lg font-semibold">Adaptation Response Calculator</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar for mobile */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-64 p-0">
            <div className="flex h-16 items-center border-b px-6">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold">ARC</span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="grid gap-2 p-4">
              <NavItem icon={<Home className="h-4 w-4" />} label="Dashboard" isActive />
              <NavItem icon={<Dumbbell className="h-4 w-4" />} label="Physical Training" />
              <NavItem icon={<Heart className="h-4 w-4" />} label="Recovery Markers" />
              <NavItem icon={<Sparkles className="h-4 w-4" />} label="Recognition Practices" />
              <NavItem icon={<FileBarChart className="h-4 w-4" />} label="Insights" />
              <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
            </nav>
          </SheetContent>
        </Sheet>

        {/* Sidebar for desktop */}
        <aside className="hidden w-64 flex-col border-r md:flex">
          <nav className="grid gap-2 p-4">
            <NavItem icon={<Home className="h-4 w-4" />} label="Dashboard" isActive />
            <NavItem icon={<Dumbbell className="h-4 w-4" />} label="Physical Training" />
            <NavItem icon={<Heart className="h-4 w-4" />} label="Recovery Markers" />
            <NavItem icon={<Sparkles className="h-4 w-4" />} label="Recognition Practices" />
            <NavItem icon={<FileBarChart className="h-4 w-4" />} label="Insights" />
            <NavItem icon={<Settings className="h-4 w-4" />} label="Settings" />
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            {/* Hero section */}
            <section className="mb-8 grid gap-4 md:grid-cols-3">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Weekly Training Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">6.2 hrs</div>
                    <div className="text-sm text-muted-foreground">+12% vs last week</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Strong positive correlation with recovery</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recovery Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">84/100</div>
                    <div className="text-sm text-muted-foreground">+5 pts vs last week</div>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-blue-200 dark:bg-blue-800">
                    <div className="h-full w-[84%] rounded-full bg-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recognition Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-3xl font-bold">68%</div>
                    <div className="text-sm text-muted-foreground">+8% vs last week</div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                    <TrendingUp className="h-4 w-4" />
                    <span>Highest predictor of recovery</span>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Correlation chart */}
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recognition & Recovery Correlation</CardTitle>
                      <CardDescription>
                        Relationship between recognition frequency and recovery metrics over time
                      </CardDescription>
                    </div>
                    <Tabs defaultValue="30days">
                      <TabsList>
                        <TabsTrigger value="7days">7 days</TabsTrigger>
                        <TabsTrigger value="30days">30 days</TabsTrigger>
                        <TabsTrigger value="90days">90 days</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <CorrelationChart />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Training metrics cards */}
            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Training Metrics</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Training Duration</CardTitle>
                      <CardDescription>Weekly minutes per session</CardDescription>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <TrainingDurationChart />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Training Intensity</CardTitle>
                      <CardDescription>Effort level distribution</CardDescription>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300">
                      <ChevronDown className="h-4 w-4 rotate-90" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <TrainingIntensityHeatmap />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Exercise Frequency</CardTitle>
                      <CardDescription>14-day trend</CardDescription>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ExerciseFrequencyChart />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="space-y-1">
                      <CardTitle className="text-base">Training Types</CardTitle>
                      <CardDescription>Activity distribution</CardDescription>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <TrainingTypesChart />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Correlation analysis */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle>Correlation Analysis</CardTitle>
                  <CardDescription>
                    Strength of relationship between training metrics and recovery scores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CorrelationAnalysis />
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

function NavItem({ icon, label, isActive }: NavItemProps) {
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "flex w-full items-center justify-start gap-2",
        isActive && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      )}
    >
      {icon}
      <span>{label}</span>
    </Button>
  )
}

