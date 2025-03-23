"use client"

import { useState, useEffect } from "react"
import { Activity, ArrowRight, Clock, Footprints, Heart, Moon, Trophy, Sparkles } from "lucide-react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { loadDataFromLocalStorage } from "@/lib/storage"
import type { HeartRateData, SleepData, StepsData, SmallWin } from "@/lib/types"
import BackupSync from "@/components/backup-sync"

export default function Dashboard() {
  const [sleepData, setSleepData] = useState<SleepData[]>([])
  const [heartRateData, setHeartRateData] = useState<HeartRateData[]>([])
  const [stepsData, setStepsData] = useState<StepsData[]>([])
  const [smallWinsData, setSmallWinsData] = useState<SmallWin[]>([])
  const router = useRouter()

  // Load data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load data from localStorage with fallbacks
        const savedSleepData = loadDataFromLocalStorage<SleepData>("fitnessMetrics_sleepData") || []
        const savedHeartRateData = loadDataFromLocalStorage<HeartRateData>("fitnessMetrics_heartRateData") || []
        const savedStepsData = loadDataFromLocalStorage<StepsData>("fitnessMetrics_stepsData") || []
        const savedSmallWinsData = loadDataFromLocalStorage<SmallWin>("fitnessMetrics_smallWinsData") || []

        // Validate and set the data
        setSleepData(savedSleepData.filter((item) => item && typeof item === "object"))
        setHeartRateData(savedHeartRateData.filter((item) => item && typeof item === "object"))
        setStepsData(savedStepsData.filter((item) => item && typeof item === "object"))
        setSmallWinsData(savedSmallWinsData.filter((item) => item && typeof item === "object"))
      } catch (error) {
        console.error("Error loading dashboard data:", error)
        // Set empty arrays as fallback
        setSleepData([])
        setHeartRateData([])
        setStepsData([])
        setSmallWinsData([])
      }
    }
  }, [])

  // Get the most recent data safely
  const getLatestData = <T extends { date: Date }>(data: T[]): T | null => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) return null

      // Filter out invalid data
      const validData = data.filter((item) => item && typeof item === "object" && item.date)

      if (validData.length === 0) return null

      // Sort by date descending
      const sortedData = [...validData].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)

        // Check if dates are valid
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0

        return dateB.getTime() - dateA.getTime()
      })

      return sortedData[0]
    } catch (error) {
      console.error("Error getting latest data:", error)
      return null
    }
  }

  // Calculate averages for the last 7 days safely
  const calculateRecentAverages = <T extends { date: Date }>(
    data: T[],
    scoreKey: keyof T,
  ): { average: number | null; trend: "up" | "down" | "stable" | null } => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) return { average: null, trend: null }

      // Filter out invalid data
      const validData = data.filter(
        (item) => item && typeof item === "object" && item.date && item[scoreKey] !== undefined,
      )

      if (validData.length === 0) return { average: null, trend: null }

      // Sort by date descending
      const sortedData = [...validData].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)

        // Check if dates are valid
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0

        return dateB.getTime() - dateA.getTime()
      })

      // Get the last 7 days of data
      const recentData = sortedData.slice(0, 7)

      if (recentData.length === 0) return { average: null, trend: null }

      // Calculate average
      const sum = recentData.reduce((acc, item) => {
        const value = item[scoreKey]
        return acc + (typeof value === "number" ? value : Number.parseFloat(value as string))
      }, 0)

      const average = sum / recentData.length

      // Calculate trend (if we have enough data)
      let trend: "up" | "down" | "stable" | null = null

      if (recentData.length >= 2) {
        const latest = recentData[0][scoreKey]
        const previous = recentData[1][scoreKey]

        const latestValue = typeof latest === "number" ? latest : Number.parseFloat(latest as string)
        const previousValue = typeof previous === "number" ? previous : Number.parseFloat(previous as string)

        if (latestValue > previousValue * 1.05) trend = "up"
        else if (latestValue < previousValue * 0.95) trend = "down"
        else trend = "stable"
      }

      return { average: average, trend }
    } catch (error) {
      console.error(`Error calculating averages for ${String(scoreKey)}:`, error)
      return { average: null, trend: null }
    }
  }

  // Get latest data
  const latestSleep = getLatestData(sleepData)
  const latestHeartRate = getLatestData(heartRateData)
  const latestSteps = getLatestData(stepsData)
  const latestSmallWin = getLatestData(smallWinsData)

  // Calculate averages
  const sleepScoreStats = calculateRecentAverages(sleepData, "sleepScore")
  const sleepHoursStats = calculateRecentAverages(sleepData, "sleepHours")
  const maxHRStats = calculateRecentAverages(heartRateData, "maxHR")
  const restingHRStats = calculateRecentAverages(heartRateData, "restingHR")
  const hrvStats = calculateRecentAverages(heartRateData, "hrv")
  const stepsStats = calculateRecentAverages(stepsData, "steps")
  const distanceStats = calculateRecentAverages(stepsData, "distance")

  // Get trend color
  const getTrendColor = (trend: "up" | "down" | "stable" | null, isPositive: boolean): string => {
    if (!trend) return "text-muted-foreground"

    if (trend === "stable") return "text-yellow-500"
    if ((trend === "up" && isPositive) || (trend === "down" && !isPositive)) return "text-green-500"
    return "text-red-500"
  }

  // Get trend icon
  const getTrendIcon = (trend: "up" | "down" | "stable" | null) => {
    if (trend === "up") return "↑"
    if (trend === "down") return "↓"
    if (trend === "stable") return "→"
    return ""
  }

  // Format date for display safely
  const formatDate = (date: Date | null): string => {
    try {
      if (!date) return "No data"

      const dateObj = date instanceof Date ? date : new Date(date)

      if (isNaN(dateObj.getTime())) return "Invalid date"

      return format(dateObj, "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return "Error"
    }
  }

  // Combine all data for backup
  const allData = {
    sleep: sleepData,
    heartRate: heartRateData,
    steps: stepsData,
    smallWins: smallWinsData,
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Fitness Dashboard</h1>
          <BackupSync data={allData} storageKey="fitnessMetrics_allData" />
        </div>
        <p className="text-muted-foreground">Track your fitness metrics over time</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Sleep Metrics</CardTitle>
              <CardDescription>Track your sleep quality</CardDescription>
            </div>
            <Moon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Sleep Score</div>
                <div className="text-2xl font-bold">
                  {sleepScoreStats.average !== null ? Math.round(sleepScoreStats.average) : "--"}
                  {sleepScoreStats.trend && (
                    <span className={`ml-2 text-sm ${getTrendColor(sleepScoreStats.trend, true)}`}>
                      {getTrendIcon(sleepScoreStats.trend)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">7-day average</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Sleep Time</div>
                <div className="text-2xl font-bold">
                  {sleepHoursStats.average !== null ? sleepHoursStats.average.toFixed(1) : "--"} hrs
                  {sleepHoursStats.trend && (
                    <span className={`ml-2 text-sm ${getTrendColor(sleepHoursStats.trend, true)}`}>
                      {getTrendIcon(sleepHoursStats.trend)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">7-day average</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => {
                try {
                  router.push("/sleep")
                } catch (error) {
                  console.error("Navigation error:", error)
                  // Fallback - reload the page to the sleep route
                  window.location.href = "/sleep"
                }
              }}
            >
              View Sleep Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Heart Rate</CardTitle>
              <CardDescription>Track your heart rate</CardDescription>
            </div>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Max HR</div>
                <div className="text-2xl font-bold">
                  {maxHRStats.average !== null ? Math.round(maxHRStats.average) : "--"}
                  {maxHRStats.trend && (
                    <span className={`ml-1 text-sm ${getTrendColor(maxHRStats.trend, false)}`}>
                      {getTrendIcon(maxHRStats.trend)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">bpm</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Resting HR</div>
                <div className="text-2xl font-bold">
                  {restingHRStats.average !== null ? Math.round(restingHRStats.average) : "--"}
                  {restingHRStats.trend && (
                    <span className={`ml-1 text-sm ${getTrendColor(restingHRStats.trend, false)}`}>
                      {getTrendIcon(restingHRStats.trend)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">bpm</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/heart-rate")}>
              View Heart Rate Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Steps & Activity</CardTitle>
              <CardDescription>Track your daily steps</CardDescription>
            </div>
            <Footprints className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Daily Steps</div>
                <div className="text-2xl font-bold">
                  {stepsStats.average !== null ? Math.round(stepsStats.average).toLocaleString() : "--"}
                  {stepsStats.trend && (
                    <span className={`ml-2 text-sm ${getTrendColor(stepsStats.trend, true)}`}>
                      {getTrendIcon(stepsStats.trend)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">7-day average</div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">Distance</div>
                <div className="text-2xl font-bold">
                  {distanceStats.average !== null ? distanceStats.average.toFixed(1) : "--"} km
                  {distanceStats.trend && (
                    <span className={`ml-2 text-sm ${getTrendColor(distanceStats.trend, true)}`}>
                      {getTrendIcon(distanceStats.trend)}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">7-day average</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/steps")}>
              View Steps Data
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Small Wins</CardTitle>
              <CardDescription>Track your achievements</CardDescription>
            </div>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-sm font-medium text-muted-foreground">Latest Small Win</div>
              {latestSmallWin ? (
                <div className="mt-1">
                  <div className="text-base font-medium truncate">{latestSmallWin.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{formatDate(latestSmallWin.date)}</div>
                </div>
              ) : (
                <div className="text-sm mt-2">No small wins recorded yet</div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/small-wins")}>
              View Small Wins
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <CardDescription>Your latest fitness metrics</CardDescription>
            </div>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestSleep && (
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Moon className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Sleep Score: {latestSleep.sleepScore}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(latestSleep.date)}</div>
                    </div>
                  </div>
                  <div className="text-sm">{latestSleep.sleepHours} hrs</div>
                </div>
              )}

              {latestHeartRate && (
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Heart Rate</div>
                      <div className="text-xs text-muted-foreground">{formatDate(latestHeartRate.date)}</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    Max: {latestHeartRate.maxHR} bpm
                    <br />
                    Rest: {latestHeartRate.restingHR} bpm
                  </div>
                </div>
              )}

              {latestSteps && (
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Footprints className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Steps: {latestSteps.steps.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(latestSteps.date)}</div>
                    </div>
                  </div>
                  <div className="text-sm">{latestSteps.distance.toFixed(1)} km</div>
                </div>
              )}

              {latestSmallWin && (
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <Trophy className="mr-2 h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Small Win: {latestSmallWin.title}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(latestSmallWin.date)}</div>
                    </div>
                  </div>
                </div>
              )}

              {!latestSleep && !latestHeartRate && !latestSteps && !latestSmallWin && (
                <div className="text-center py-4 text-muted-foreground">No recent activity data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>Add new data or view reports</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => {
                  try {
                    router.push("/sleep")
                  } catch (error) {
                    console.error("Navigation error:", error)
                    // Fallback - reload the page to the sleep route
                    window.location.href = "/sleep"
                  }
                }}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Moon className="mb-1 h-5 w-5" />
                <span>Sleep</span>
              </Button>
              <Button
                onClick={() => router.push("/heart-rate")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Heart className="mb-1 h-5 w-5" />
                <span>Heart Rate</span>
              </Button>
              <Button onClick={() => router.push("/steps")} className="h-20 flex flex-col items-center justify-center">
                <Footprints className="mb-1 h-5 w-5" />
                <span>Steps</span>
              </Button>
              <Button
                onClick={() => router.push("/small-wins")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Trophy className="mb-1 h-5 w-5" />
                <span>Small Wins</span>
              </Button>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => router.push("/adaptation-calculator")}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Sparkles className="h-4 w-4" />
                <span>Adaptation Response Calculator</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

