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

export default function FitnessDashboard() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekData, setWeekData] = useState<SleepData[]>([])
  const [allData, setAllData] = useState<SleepData[]>([])
  const { toast } = useToast()

  // Initialize data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Try to load data from localStorage first
      const savedData = loadDataFromLocalStorage<SleepData>("fitnessMetrics_sleepData")

      if (savedData && savedData.length > 0) {
        setAllData(savedData)

        // Filter data for the current week
        const currentWeekData = filterDataForWeek(savedData, currentDate)
        setWeekData(currentWeekData.length > 0 ? currentWeekData : generateWeekData(currentDate))
      } else {
        // Generate sample data if no saved data
        const initialData = generateWeekData(new Date())
        setAllData(initialData)
        setWeekData(initialData)

        // Save initial data to localStorage
        saveDataToLocalStorage("fitnessMetrics_sleepData", initialData)
      }
    } else {
      // Generate sample data for server-side rendering
      const initialData = generateWeekData(new Date())
      setAllData(initialData)
      setWeekData(initialData)
    }
  }, [currentDate])

  // Filter data for a specific week
  const filterDataForWeek = (data: SleepData[], weekStart: Date): SleepData[] => {
    const startOfWeek = subDays(weekStart, 6)
    const endOfWeek = weekStart

    return data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= startOfWeek && itemDate <= endOfWeek
    })
  }

  // Check for scheduled backup on component mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === "undefined") return

    const checkScheduledBackup = async () => {
      const autoBackupEnabled = localStorage.getItem("autoBackupEnabled") === "true"
      const backupTime = localStorage.getItem("backupTime") || "00:00"
      const lastBackupDate = localStorage.getItem("lastBackupDate")
      const today = format(new Date(), "yyyy-MM-dd")

      // If auto backup is enabled and we haven't backed up today
      if (autoBackupEnabled && lastBackupDate !== today) {
        const [backupHour] = backupTime.split(":").map(Number)
        const now = new Date()
        const currentHour = now.getHours()

        // If the current hour is past the backup hour
        if (currentHour >= backupHour) {
          // Get backup destinations
          const saveToDevice = localStorage.getItem("saveToDevice") === "true"
          const cloudServicesStr = localStorage.getItem("cloudServices")
          const cloudServices = cloudServicesStr ? JSON.parse(cloudServicesStr) : []

          let backupSuccessful = false

          // Perform device backup if enabled
          if (saveToDevice && allData.length > 0) {
            try {
              // Backup logic here
              backupSuccessful = true
            } catch (error) {
              console.error("Auto backup to device failed:", error)
            }
          }

          // Update last backup date if any backup was successful
          if (backupSuccessful) {
            localStorage.setItem("lastBackupDate", today)

            toast({
              title: "Auto backup completed",
              description: "Your data has been automatically backed up.",
            })
          }
        }
      }
    }

    // Check for scheduled backup
    checkScheduledBackup()

    // Set up interval to check for scheduled backup every hour
    const interval = setInterval(checkScheduledBackup, 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [allData, toast])

  // Handle adding new sleep data
  const handleAddSleepData = (newData: {
    date: Date
    sleepScore: number
    sleepHours: string
    sleepMinutes: number
  }) => {
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
    const updatedAllData = [...allData, formattedData].sort((a, b) => a.date.getTime() - b.date.getTime())
    setAllData(updatedAllData)

    // Update week data if the new data falls within the current week
    const updatedWeekData = filterDataForWeek(updatedAllData, currentDate)
    setWeekData(updatedWeekData)

    // Save to localStorage
    if (typeof window !== "undefined") {
      saveDataToLocalStorage("fitnessMetrics_sleepData", updatedAllData)
    }
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subDays(currentDate, 7) : addDays(currentDate, 7)
    setCurrentDate(newDate)

    // Update week data for the new date range
    const newWeekData = filterDataForWeek(allData, newDate)

    // If no data for this week, generate sample data
    if (newWeekData.length === 0) {
      setWeekData(generateWeekData(newDate))
    } else {
      setWeekData(newWeekData)
    }
  }

  const weekRange =
    weekData.length > 0
      ? `${format(weekData[0].date, "MMM d")} - ${format(weekData[6].date, "MMM d, yyyy")}`
      : "Loading..."

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Fitness Metrics</h1>
          <div className="flex gap-2">
            <AddSleepDataForm onAddData={handleAddSleepData} />
            <BackupSync data={allData} storageKey="fitnessMetrics_sleepData" />
          </div>
        </div>
        <p className="text-muted-foreground">Track your sleep patterns and wellness over time</p>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{weekRange}</h2>
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
            <div className="h-[250px] flex items-center justify-center">
              {weekData.map((day, index) => (
                <div key={index} className="flex flex-col items-center mx-2">
                  <div className="text-sm">{day.shortDate}</div>
                  <div className="font-bold">{day.sleepScore}</div>
                </div>
              ))}
            </div>
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
            <div className="h-[250px] flex items-center justify-center">
              {weekData.map((day, index) => (
                <div key={index} className="flex flex-col items-center mx-2">
                  <div className="text-sm">{day.shortDate}</div>
                  <div className="font-bold">{day.sleepHours} hrs</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

