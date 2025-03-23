"use client"

import { useState, useEffect } from "react"
import { Calendar, Download, Upload, Save } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { convertToCSV, convertToJSON, downloadFile, getTimestamp, getServiceName } from "@/lib/export"
import AutoBackupSettings from "./auto-backup-settings"

interface BackupSyncProps {
  data: any
  storageKey?: string
}

export default function BackupSync({ data, storageKey = "fitnessMetrics_sleepData" }: BackupSyncProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMultiBackupDialogOpen, setIsMultiBackupDialogOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<{
    saveToDevice: boolean
    dropbox: boolean
    googleDrive: boolean
    oneDrive: boolean
  }>({
    saveToDevice: true,
    dropbox: false,
    googleDrive: false,
    oneDrive: false,
  })
  const { toast } = useToast()

  // Load last backup date from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLastBackupDate(localStorage.getItem(`${storageKey}_lastBackupDate`))
    }
  }, [storageKey])

  // Export data as CSV
  const exportCSV = () => {
    try {
      setIsExporting(true)
      const csvContent = convertToCSV(data)
      const timestamp = getTimestamp()
      const fileName = storageKey.includes("all") ? "fitness-data" : storageKey.replace("fitnessMetrics_", "")
      downloadFile(csvContent, `${fileName}-${timestamp}.csv`, "text/csv")

      // Update last backup date
      const now = format(new Date(), "yyyy-MM-dd")
      localStorage.setItem(`${storageKey}_lastBackupDate`, now)
      setLastBackupDate(now)

      toast({
        title: "Export successful",
        description: "Your fitness data has been exported as CSV.",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Export data as JSON
  const exportJSON = () => {
    try {
      setIsExporting(true)
      const jsonContent = convertToJSON(data)
      const timestamp = getTimestamp()
      const fileName = storageKey.includes("all") ? "fitness-data" : storageKey.replace("fitnessMetrics_", "")
      downloadFile(jsonContent, `${fileName}-${timestamp}.json`, "application/json")

      // Update last backup date
      const now = format(new Date(), "yyyy-MM-dd")
      localStorage.setItem(`${storageKey}_lastBackupDate`, now)
      setLastBackupDate(now)

      toast({
        title: "Export successful",
        description: "Your fitness data has been exported as JSON.",
      })
    } catch (error) {
      console.error("Error exporting JSON:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Handle cloud service authentication and upload
  const handleCloudUpload = (service: "dropbox" | "google-drive" | "onedrive") => {
    setIsDialogOpen(false)

    // In a real implementation, we would:
    // 1. Authenticate with the service using OAuth
    // 2. Upload the file using the service's API
    // 3. Handle success/failure

    // For now, we'll simulate the process
    toast({
      title: "Connecting to " + getServiceName(service),
      description: "Please authenticate to continue...",
    })

    // Simulate authentication and upload process
    setTimeout(() => {
      const now = format(new Date(), "yyyy-MM-dd")
      localStorage.setItem(`${storageKey}_lastBackupDate`, now)
      setLastBackupDate(now)

      toast({
        title: "Backup successful",
        description: `Your data has been backed up to ${getServiceName(service)}.`,
      })
    }, 2000)
  }

  // Toggle selection of a service
  const toggleService = (service: keyof typeof selectedServices) => {
    setSelectedServices((prev) => ({
      ...prev,
      [service]: !prev[service],
    }))
  }

  // Perform multi-destination backup
  const performMultiBackup = async () => {
    setIsMultiBackupDialogOpen(false)
    setIsExporting(true)

    try {
      const timestamp = getTimestamp()
      const now = format(new Date(), "yyyy-MM-dd")
      let successCount = 0
      const fileName = storageKey.includes("all") ? "fitness-data" : storageKey.replace("fitnessMetrics_", "")

      // Save to device if selected
      if (selectedServices.saveToDevice) {
        const csvContent = convertToCSV(data)
        const jsonContent = convertToJSON(data)

        downloadFile(csvContent, `${fileName}-${timestamp}.csv`, "text/csv")
        downloadFile(jsonContent, `${fileName}-${timestamp}.json`, "application/json")

        successCount++
      }

      // Sync to cloud services if selected
      const selectedCloudServices = []

      if (selectedServices.dropbox) {
        // Simulate Dropbox upload
        await new Promise((resolve) => setTimeout(resolve, 1000))
        selectedCloudServices.push("Dropbox")
        successCount++
      }

      if (selectedServices.googleDrive) {
        // Simulate Google Drive upload
        await new Promise((resolve) => setTimeout(resolve, 1000))
        selectedCloudServices.push("Google Drive")
        successCount++
      }

      if (selectedServices.oneDrive) {
        // Simulate OneDrive upload
        await new Promise((resolve) => setTimeout(resolve, 1000))
        selectedCloudServices.push("OneDrive")
        successCount++
      }

      // Update last backup date
      localStorage.setItem(`${storageKey}_lastBackupDate`, now)
      setLastBackupDate(now)

      // Show success message
      if (successCount > 0) {
        let description = "Your data has been backed up"

        if (selectedServices.saveToDevice && selectedCloudServices.length > 0) {
          description += " to your device and " + selectedCloudServices.join(", ")
        } else if (selectedServices.saveToDevice) {
          description += " to your device"
        } else if (selectedCloudServices.length > 0) {
          description += " to " + selectedCloudServices.join(", ")
        }

        toast({
          title: "Backup successful",
          description: description + ".",
        })
      }
    } catch (error) {
      console.error("Error performing multi-backup:", error)
      toast({
        title: "Backup failed",
        description: "There was an error backing up your data.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Check if any service is selected
  const isAnyServiceSelected = Object.values(selectedServices).some(Boolean)

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Upload className="h-4 w-4" />
            Backup & Sync
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuItem onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportJSON}>
            <Download className="mr-2 h-4 w-4" />
            Export as JSON
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuLabel>Cloud Sync</DropdownMenuLabel>

          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Sync to Cloud
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsMultiBackupDialogOpen(true)}>
            <Save className="mr-2 h-4 w-4" />
            Multi-Destination Backup
          </DropdownMenuItem>

          {lastBackupDate && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="flex items-center text-xs text-muted-foreground">
                <Calendar className="mr-2 h-3 w-3" />
                Last backup: {lastBackupDate}
              </DropdownMenuLabel>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AutoBackupSettings storageKey={storageKey} />

      {/* Cloud Service Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sync to Cloud</DialogTitle>
            <DialogDescription>Choose a cloud service to back up your fitness data.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Button variant="outline" className="justify-start gap-2" onClick={() => handleCloudUpload("dropbox")}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L6 7l6 5-6 5 6 5 6-5-6-5 6-5z" />
              </svg>
              Dropbox
            </Button>

            <Button variant="outline" className="justify-start gap-2" onClick={() => handleCloudUpload("google-drive")}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.5 14.5L8 20h8l3.5-5.5-8-13.5z" />
                <path d="M16 20h4l-7-12.5L8 20" />
                <path d="M4 15l3.5 5H12l-4-7z" />
              </svg>
              Google Drive
            </Button>

            <Button variant="outline" className="justify-start gap-2" onClick={() => handleCloudUpload("onedrive")}>
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 8.5c1.5-1.5 4.5-2 6 .5 2-1 4 0 4 2.5 0 3-2 4-4 4H7c-2.5 0-4-2-4-4 0-2.5 2-4 4-4 .5 0 1 0 1.5.5C9 7 9.5 7.5 10 8.5z" />
              </svg>
              OneDrive
            </Button>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Multi-Destination Backup Dialog */}
      <Dialog open={isMultiBackupDialogOpen} onOpenChange={setIsMultiBackupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Multi-Destination Backup</DialogTitle>
            <DialogDescription>Back up your fitness data to multiple destinations at once.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-to-device-multi"
                checked={selectedServices.saveToDevice}
                onCheckedChange={() => toggleService("saveToDevice")}
              />
              <Label htmlFor="save-to-device-multi" className="text-sm">
                Save to device (JSON & CSV)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="dropbox-multi"
                checked={selectedServices.dropbox}
                onCheckedChange={() => toggleService("dropbox")}
              />
              <Label htmlFor="dropbox-multi" className="text-sm">
                Sync to Dropbox
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="google-drive-multi"
                checked={selectedServices.googleDrive}
                onCheckedChange={() => toggleService("googleDrive")}
              />
              <Label htmlFor="google-drive-multi" className="text-sm">
                Sync to Google Drive
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="onedrive-multi"
                checked={selectedServices.oneDrive}
                onCheckedChange={() => toggleService("oneDrive")}
              />
              <Label htmlFor="onedrive-multi" className="text-sm">
                Sync to OneDrive
              </Label>
            </div>

            {!isAnyServiceSelected && (
              <p className="text-xs text-destructive mt-2">Please select at least one backup destination.</p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMultiBackupDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={performMultiBackup} disabled={!isAnyServiceSelected || isExporting}>
              {isExporting ? "Backing up..." : "Backup Now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

