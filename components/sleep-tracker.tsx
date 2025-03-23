"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Clock, Moon } from "lucide-react"
import { format, subDays, addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import BackupSync from "@/components/backup-sync"
import AddSleepDataForm from "@/components/add-sleep-data-form"
import { saveDataToLocalStorage, loadDataFromLocalStorage } from "@/lib/storage"
import type { SleepData } from "@/lib/types"
import SleepScoreChart from "@/components/sleep-score-chart"
import SleepTimeChart from "@/components/sleep-time-chart"
import { useRouter } from "next/navigation"

// Sample data for the past 7 days
const generateWeekData = (startDate: Date): SleepData[] => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(startDate, 6 - i)
    return {
      date,
      dateString: format(date, "EEE, MMM d"),
      shortDate: format(date, "EEE"),
      sleepScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-100
      sleepHours: (Math.random() * 2 + 6).toFixed(1), // Random hours between 6-8
      sleepMinutes: Math.floor((Math.random() * 2 + 6) * 60), // Convert hours to minutes
    }
  })
}

export default function SleepTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekData, setWeekData] = useState<SleepData[]>([])
  const [allData, setAllData] = useState<SleepData[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Initialize data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Generate initial sample data
        const initialData = generateWeekData(new Date())

        // Try to load data from localStorage
        const savedData = loadDataFromLocalStorage<SleepData>("fitnessMetrics_sleepData")

        // If we have saved data, use it; otherwise use the sample data
        if (savedData && Array.isArray(savedData) && savedData.length > 0) {
          // Ensure all data has valid date objects
          const validatedData = savedData
            .filter((item) => item && typeof item === "object")
            .map((item) => ({
              ...item,
              // Convert date strings to Date objects if needed
              date: item.date instanceof Date ? item.date : new Date(item.date),
            }))

          setAllData(validatedData)

          // Filter data for the current week
          const currentWeekData = filterDataForWeek(validatedData, currentDate)
          setWeekData(currentWeekData.length > 0 ? currentWeekData : initialData)
        } else {
          // Use sample data if no saved data
          setAllData(initialData)
          setWeekData(initialData)

          // Save initial data to localStorage
          saveDataToLocalStorage("fitnessMetrics_sleepData", initialData)
        }
      } catch (error) {
        console.error("Error loading sleep data:", error)
        // Fallback to sample data
        const initialData = generateWeekData(new Date())
        setAllData(initialData)
        setWeekData(initialData)

        // Save the fallback data to localStorage
        saveDataToLocalStorage("fitnessMetrics_sleepData", initialData)
      }
    } else {
      // Generate sample data for server-side rendering
      const initialData = generateWeekData(new Date())
      setAllData(initialData)
      setWeekData(initialData)
    }
  }, [])

  // Filter data for a specific week
  const filterDataForWeek = (data: SleepData[], weekStart: Date): SleepData[] => {
    if (!data || !Array.isArray(data) || data.length === 0) return []

    const startOfWeek = subDays(weekStart, 6)
    const endOfWeek = weekStart

    return data.filter((item) => {
      if (!item || typeof item !== "object" || !item.date) return false

      // Ensure date is a Date object
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date)

      // Check if the date is valid
      if (isNaN(itemDate.getTime())) return false

      return itemDate >= startOfWeek && itemDate <= endOfWeek
    })
  }

  // Handle adding new sleep data
  const handleAddSleepData = (newData: {
    date: Date
    sleepScore: number
    sleepHours: string
    sleepMinutes: number
  }) => {
    try {
      // Format the new data
      const formattedData: SleepData = {
        date: newData.date,
        dateString: format(newData.date, "EEE, MMM d"),
        shortDate: format(newData.date, "EEE"),
        sleepScore: newData.sleepScore,
        sleepHours: newData.sleepHours,
        sleepMinutes: newData.sleepMinutes,
      }

      // Add to all data
      const updatedAllData = [...allData, formattedData].sort((a, b) => {
        const dateA = a.date instanceof Date ? a.date : new Date(a.date)
        const dateB = b.date instanceof Date ? b.date : new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })
      setAllData(updatedAllData)

      // Update week data if the new data falls within the current week
      const updatedWeekData = filterDataForWeek(updatedAllData, currentDate)
      setWeekData(updatedWeekData)

      // Save to localStorage
      if (typeof window !== "undefined") {
        saveDataToLocalStorage("fitnessMetrics_sleepData", updatedAllData)
      }
    } catch (error) {
      console.error("Error adding sleep data:", error)
      toast({
        title: "Error",
        description: "Failed to add sleep data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subDays(currentDate, 7) : addDays(currentDate, 7)
    setCurrentDate(newDate)
  }

  // Update week data when current date changes
  useEffect(() => {
    if (allData.length > 0) {
      const newWeekData = filterDataForWeek(allData, currentDate)
      if (newWeekData.length > 0) {
        setWeekData(newWeekData)
      } else {
        // Generate sample data for the new week if no data exists
        setWeekData(generateWeekData(currentDate))
      }
    }
  }, [currentDate, allData])

  // Safely format the week range
  const getWeekRange = () => {
    try {
      if (!weekData || weekData.length < 7) {
        return "Loading..."
      }

      const firstDay = weekData[0]
      const lastDay = weekData[6]

      if (!firstDay || !firstDay.date || !lastDay || !lastDay.date) {
        return "Loading..."
      }

      const firstDate = firstDay.date instanceof Date ? firstDay.date : new Date(firstDay.date)
      const lastDate = lastDay.date instanceof Date ? lastDay.date : new Date(lastDay.date)

      if (isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) {
        return "Loading..."
      }

      return `${format(firstDate, "MMM d")} - ${format(lastDate, "MMM d, yyyy")}`
    } catch (error) {
      console.error("Error formatting week range:", error)
      return "Loading..."
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Sleep Metrics</h1>
          </div>
          <div className="flex gap-2">
            <AddSleepDataForm onAddData={handleAddSleepData} />
            <BackupSync data={allData} storageKey="fitnessMetrics_sleepData" />
          </div>
        </div>
        <p className="text-muted-foreground">Track your sleep patterns and wellness over time</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{getWeekRange()}</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Sleep Score</CardTitle>
              <CardDescription>Daily sleep quality score</CardDescription>
            </div>
            <Moon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <SleepScoreChart data={weekData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Sleep Time</CardTitle>
              <CardDescription>Hours of sleep per night</CardDescription>
            </div>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <SleepTimeChart data={weekData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Average Score</CardTitle>
              <CardDescription>Weekly average</CardDescription>
            </div>
            <Moon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weekData.length > 0
                ? Math.round(weekData.reduce((sum, day) => sum + day.sleepScore, 0) / weekData.length)
                : "--"}
            </div>
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
            <div className="text-2xl font-bold">
              {weekData.length > 0
                ? (weekData.reduce((sum, day) => sum + Number.parseFloat(day.sleepHours), 0) / weekData.length).toFixed(
                    1,
                  )
                : "--"}{" "}
              hrs
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Best Sleep</CardTitle>
              <CardDescription>Highest score this week</CardDescription>
            </div>
            <Moon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {weekData.length > 0 ? Math.max(...weekData.map((day) => day.sleepScore)) : "--"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

