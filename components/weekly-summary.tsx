import { Clock, Moon, TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SleepData {
  date: Date
  dateString: string
  shortDate: string
  sleepScore: number
  sleepHours: string
  sleepMinutes: number
}

interface WeeklySummaryProps {
  data: SleepData[]
}

// Update the WeeklySummary component to handle empty or undefined data

export default function WeeklySummary({ data }: WeeklySummaryProps) {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Weekly Summary</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Average Score</CardTitle>
                <CardDescription>Weekly sleep quality</CardDescription>
              </div>
              <Moon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground mt-1">No data available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Average Time</CardTitle>
                <CardDescription>Hours per night</CardDescription>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-- hrs</div>
              <p className="text-xs text-muted-foreground mt-1">No data available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Sleep Quality</CardTitle>
                <CardDescription>Best and worst days</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Best</span>
                  <span className="text-sm font-bold">--</span>
                </div>
                <p className="text-xs text-muted-foreground">No data</p>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Worst</span>
                  <span className="text-sm font-bold">--</span>
                </div>
                <p className="text-xs text-muted-foreground">No data</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Filter out any undefined or invalid entries
  const validData = data.filter((day) => day && typeof day.sleepScore === "number")

  // Calculate averages only if we have valid data
  const avgScore =
    validData.length > 0 ? Math.round(validData.reduce((sum, day) => sum + day.sleepScore, 0) / validData.length) : 0

  const avgHours =
    validData.length > 0
      ? (validData.reduce((sum, day) => sum + Number.parseFloat(day.sleepHours), 0) / validData.length).toFixed(1)
      : "0.0"

  // Find best and worst days only if we have valid data
  const bestDay = validData.length > 0 ? [...validData].sort((a, b) => b.sleepScore - a.sleepScore)[0] : null

  const worstDay = validData.length > 0 ? [...validData].sort((a, b) => a.sleepScore - b.sleepScore)[0] : null

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Weekly Summary</h2>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Average Score</CardTitle>
              <CardDescription>Weekly sleep quality</CardDescription>
            </div>
            <Moon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore || "--"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {validData.length > 0 ? "out of 100 points" : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Average Time</CardTitle>
              <CardDescription>Hours per night</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{validData.length > 0 ? `${avgHours} hrs` : "--"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {validData.length > 0
                ? `${(Number.parseFloat(avgHours) * 60).toFixed(0)} minutes per night`
                : "No data available"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Sleep Quality</CardTitle>
              <CardDescription>Best and worst days</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Best</span>
                <span className="text-sm font-bold">{bestDay ? bestDay.sleepScore : "--"}</span>
              </div>
              <p className="text-xs text-muted-foreground">{bestDay ? bestDay.dateString : "No data"}</p>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Worst</span>
                <span className="text-sm font-bold">{worstDay ? worstDay.sleepScore : "--"}</span>
              </div>
              <p className="text-xs text-muted-foreground">{worstDay ? worstDay.dateString : "No data"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

