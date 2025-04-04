"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Footprints, Route, Flame, Timer } from "lucide-react"
import { format, subDays, addDays } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import BackupSync from "@/components/backup-sync"
import AddStepsForm from "@/components/add-steps-form"
import { saveDataToLocalStorage, loadDataFromLocalStorage } from "@/lib/storage"
import type { StepsData } from "@/lib/types"
import StepsChart from "@/components/steps-chart"
import DistanceChart from "@/components/distance-chart"
import { useRouter } from "next/navigation"

// Sample data for the past 7 days
const generateWeekData = (startDate: Date): StepsData[] => {
  return Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(startDate, 6 - i)
    const steps = Math.floor(Math.random() * 5000) + 5000 // Random steps between 5000-10000
    return {
      date,
      dateString: format(date, "EEE, MMM d"),
      shortDate: format(date, "EEE"),
      steps,
      distance: Number.parseFloat((steps * 0.0008).toFixed(2)), // Approx distance in km
      calories: Math.floor(steps * 0.04), // Approx calories burned
      activeMinutes: Math.floor(steps / 180), // Approx active minutes
    }
  })
}

export default function StepsTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekData, setWeekData] = useState<StepsData[]>([])
  const [allData, setAllData] = useState<StepsData[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Initialize data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Generate initial sample data
        const initialData = generateWeekData(new Date())

        // Try to load data from localStorage
        const savedData = loadDataFromLocalStorage<StepsData>("fitnessMetrics_stepsData")

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
          saveDataToLocalStorage("fitnessMetrics_stepsData", initialData)
        }
      } catch (error) {
        console.error("Error loading steps data:", error)
        // Fallback to sample data
        const initialData = generateWeekData(new Date())
        setAllData(initialData)
        setWeekData(initialData)

        // Save the fallback data to localStorage
        saveDataToLocalStorage("fitnessMetrics_stepsData", initialData)
      }
    } else {
      // Generate sample data for server-side rendering
      const initialData = generateWeekData(new Date())
      setAllData(initialData)
      setWeekData(initialData)
    }
  }, [])

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

  // Filter data for a specific week
  const filterDataForWeek = (data: StepsData[], weekStart: Date): StepsData[] => {
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

  // Handle adding new steps data
  const handleAddStepsData = (newData: {
    date: Date
    steps: number
    distance: number
    calories: number
    activeMinutes: number
  }) => {
    try {
      // Format the new data
      const formattedData: StepsData = {
        date: newData.date,
        dateString: format(newData.date, "EEE, MMM d"),
        shortDate: format(newData.date, "EEE"),
        steps: newData.steps,
        distance: newData.distance,
        calories: newData.calories,
        activeMinutes: newData.activeMinutes,
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
      if (updatedWeekData.length > 0) {
        setWeekData(updatedWeekData)
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        saveDataToLocalStorage("fitnessMetrics_stepsData", updatedAllData)
      }
    } catch (error) {
      console.error("Error adding steps data:", error)
      toast({
        title: "Error",
        description: "Failed to add steps data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subDays(currentDate, 7) : addDays(currentDate, 7)
    setCurrentDate(newDate)
  }

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

  // Calculate average metrics safely
  const calculateAverage = (data: StepsData[], key: keyof StepsData): number | null => {
    try {
      if (!data || data.length === 0) return null

      const validData = data.filter((item) => item && typeof item === "object" && typeof item[key] === "number")

      if (validData.length === 0) return null

      const sum = validData.reduce((acc, item) => acc + (item[key] as number), 0)
      return sum / validData.length
    } catch (error) {
      console.error(`Error calculating average for ${String(key)}:`, error)
      return null
    }
  }

  // Calculate total metrics safely
  const calculateTotal = (data: StepsData[], key: keyof StepsData): number | null => {
    try {
      if (!data || data.length === 0) return null

      const validData = data.filter((item) => item && typeof item === "object" && typeof item[key] === "number")

      if (validData.length === 0) return null

      return validData.reduce((acc, item) => acc + (item[key] as number), 0)
    } catch (error) {
      console.error(`Error calculating total for ${String(key)}:`, error)
      return null
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
            <h1 className="text-2xl font-bold tracking-tight">Steps Tracker</h1>
          </div>
          <div className="flex gap-2">
            <AddStepsForm onAddData={handleAddStepsData} />
            <BackupSync data={allData} storageKey="fitnessMetrics_stepsData" />
          </div>
        </div>
        <p className="text-muted-foreground">Track your daily steps and activity metrics</p>
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
              <CardTitle className="text-base">Daily Steps</CardTitle>
              <CardDescription>Step count per day</CardDescription>
            </div>
            <Footprints className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <StepsChart data={weekData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Distance Walked</CardTitle>
              <CardDescription>Kilometers per day</CardDescription>
            </div>
            <Route className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <DistanceChart data={weekData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Average Steps</CardTitle>
              <CardDescription>Weekly average</CardDescription>
            </div>
            <Footprints className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateAverage(weekData, "steps") !== null
                ? Math.round(calculateAverage(weekData, "steps")!).toLocaleString()
                : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Calories Burned</CardTitle>
              <CardDescription>Weekly total</CardDescription>
            </div>
            <Flame className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateTotal(weekData, "calories") !== null
                ? calculateTotal(weekData, "calories")!.toLocaleString()
                : "--"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle className="text-base">Active Minutes</CardTitle>
              <CardDescription>Weekly total</CardDescription>
            </div>
            <Timer className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculateTotal(weekData, "activeMinutes") !== null
                ? calculateTotal(weekData, "activeMinutes")!.toLocaleString()
                : "--"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

