"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Search, Tag, Calendar, Trophy, Filter } from "lucide-react"
import { format, subMonths, addMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import BackupSync from "@/components/backup-sync"
import AddSmallWinForm from "@/components/add-small-win-form"
import { saveDataToLocalStorage, loadDataFromLocalStorage } from "@/lib/storage"
import type { SmallWin } from "@/lib/types"
import { SMALL_WIN_TAGS } from "@/lib/types"

export default function SmallWinsTracker() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [monthData, setMonthData] = useState<SmallWin[]>([])
  const [allData, setAllData] = useState<SmallWin[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Initialize data on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Try to load data from localStorage
        const savedData = loadDataFromLocalStorage<SmallWin>("fitnessMetrics_smallWinsData")

        // If we have saved data, use it; otherwise use empty array
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

          // Filter data for the current month
          const currentMonthData = filterDataForMonth(validatedData, currentDate)
          setMonthData(currentMonthData)
        } else {
          // Use empty array if no saved data
          setAllData([])
          setMonthData([])
        }
      } catch (error) {
        console.error("Error loading small wins data:", error)
        // Fallback to empty array
        setAllData([])
        setMonthData([])
      }
    }
  }, [])

  // Update month data when current date changes
  useEffect(() => {
    if (allData.length > 0) {
      const newMonthData = filterDataForMonth(allData, currentDate)
      setMonthData(newMonthData)
    }
  }, [currentDate, allData])

  // Filter data for a specific month
  const filterDataForMonth = (data: SmallWin[], monthDate: Date): SmallWin[] => {
    if (!data || !Array.isArray(data) || data.length === 0) return []

    const start = startOfMonth(monthDate)
    const end = endOfMonth(monthDate)

    return data.filter((item) => {
      if (!item || typeof item !== "object" || !item.date) return false

      // Ensure date is a Date object
      const itemDate = item.date instanceof Date ? item.date : new Date(item.date)

      // Check if the date is valid
      if (isNaN(itemDate.getTime())) return false

      return isWithinInterval(itemDate, { start, end })
    })
  }

  // Handle adding new small win
  const handleAddSmallWin = (newData: SmallWin) => {
    try {
      // Add to all data
      const updatedAllData = [...allData, newData].sort((a, b) => b.date.getTime() - a.date.getTime())
      setAllData(updatedAllData)

      // Update month data if the new data falls within the current month
      const updatedMonthData = filterDataForMonth(updatedAllData, currentDate)
      setMonthData(updatedMonthData)

      // Save to localStorage
      if (typeof window !== "undefined") {
        saveDataToLocalStorage("fitnessMetrics_smallWinsData", updatedAllData)
      }
    } catch (error) {
      console.error("Error adding small win:", error)
      toast({
        title: "Error",
        description: "Failed to add small win. Please try again.",
        variant: "destructive",
      })
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1)
    setCurrentDate(newDate)
  }

  // Filter data based on search query and selected tag
  const filteredData = monthData.filter((win) => {
    const matchesSearch =
      searchQuery === "" ||
      win.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      win.content.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag = selectedTag === null || win.tag === selectedTag

    return matchesSearch && matchesTag
  })

  // Delete a small win
  const deleteSmallWin = (id: string) => {
    try {
      // Filter out the small win with the given id
      const updatedAllData = allData.filter((win) => win.id !== id)
      setAllData(updatedAllData)

      // Update month data
      const updatedMonthData = filterDataForMonth(updatedAllData, currentDate)
      setMonthData(updatedMonthData)

      // Save to localStorage
      if (typeof window !== "undefined") {
        saveDataToLocalStorage("fitnessMetrics_smallWinsData", updatedAllData)
      }

      toast({
        title: "Small Win deleted",
        description: "Your small win has been deleted.",
      })
    } catch (error) {
      console.error("Error deleting small win:", error)
      toast({
        title: "Error",
        description: "Failed to delete small win. Please try again.",
        variant: "destructive",
      })
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
            <h1 className="text-2xl font-bold tracking-tight">Small Wins</h1>
          </div>
          <div className="flex gap-2">
            <AddSmallWinForm onAddData={handleAddSmallWin} />
            <BackupSync data={allData} storageKey="fitnessMetrics_smallWinsData" />
          </div>
        </div>
        <p className="text-muted-foreground">Track and celebrate your achievements, no matter how small</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search small wins..."
              className="pl-8 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedTag || ""} onValueChange={(value) => setSelectedTag(value || null)}>
            <SelectTrigger className="w-full md:w-[150px]">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <span>{selectedTag || "All Tags"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {SMALL_WIN_TAGS.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No small wins yet</h3>
            <p className="text-muted-foreground text-center mt-1 mb-4">
              {searchQuery || selectedTag
                ? "No small wins match your search criteria."
                : "Start tracking your achievements by adding your first small win."}
            </p>
            {(searchQuery || selectedTag) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTag(null)
                }}
              >
                Clear Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredData.map((win) => (
            <Card key={win.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{win.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {win.tag}
                      </Badge>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {win.dateString}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <Filter className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => deleteSmallWin(win.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{win.content}</p>

                {win.mediaType === "audio" && win.mediaUrl && (
                  <div className="mt-4">
                    <audio src={win.mediaUrl} controls className="w-full" />
                  </div>
                )}

                {win.mediaType === "video" && win.mediaUrl && (
                  <div className="mt-4">
                    <video src={win.mediaUrl} controls className="w-full max-h-[300px]" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

