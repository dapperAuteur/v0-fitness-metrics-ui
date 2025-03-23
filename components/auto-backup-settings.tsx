"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { getServiceName } from "@/lib/export"

interface AutoBackupSettingsProps {
  storageKey?: string
}

export default function AutoBackupSettings({ storageKey = "fitnessMetrics_sleepData" }: AutoBackupSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(false)
  const [backupTime, setBackupTime] = useState("00:00")
  const [saveToDevice, setSaveToDevice] = useState(true)
  const [cloudServices, setCloudServices] = useState<string[]>([])
  const { toast } = useToast()

  // Load settings from localStorage on component mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedAutoBackup = localStorage.getItem(`${storageKey}_autoBackupEnabled`)
      const savedBackupTime = localStorage.getItem(`${storageKey}_backupTime`)
      const savedSaveToDevice = localStorage.getItem(`${storageKey}_saveToDevice`)
      const savedCloudServices = localStorage.getItem(`${storageKey}_cloudServices`)

      if (savedAutoBackup) setAutoBackupEnabled(savedAutoBackup === "true")
      if (savedBackupTime) setBackupTime(savedBackupTime)
      if (savedSaveToDevice) setSaveToDevice(savedSaveToDevice === "true")
      if (savedCloudServices) setCloudServices(JSON.parse(savedCloudServices))
    } catch (error) {
      console.error("Error loading backup settings:", error)
    }
  }, [storageKey])

  // Toggle cloud service selection
  const toggleCloudService = (service: string) => {
    setCloudServices((prev) => {
      if (prev.includes(service)) {
        return prev.filter((s) => s !== service)
      } else {
        return [...prev, service]
      }
    })
  }

  // Save settings
  const saveSettings = () => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(`${storageKey}_autoBackupEnabled`, autoBackupEnabled.toString())
      localStorage.setItem(`${storageKey}_backupTime`, backupTime)
      localStorage.setItem(`${storageKey}_saveToDevice`, saveToDevice.toString())
      localStorage.setItem(`${storageKey}_cloudServices`, JSON.stringify(cloudServices))

      setIsOpen(false)

      // Create description of backup destinations
      const destinations = []
      if (saveToDevice) destinations.push("your device")
      if (cloudServices.length > 0) {
        destinations.push(cloudServices.map(getServiceName).join(", "))
      }

      const destinationText = destinations.length > 0 ? `to ${destinations.join(" and ")}` : ""

      toast({
        title: autoBackupEnabled ? "Auto backup enabled" : "Auto backup disabled",
        description: autoBackupEnabled
          ? `Your data will be backed up daily at ${backupTime} ${destinationText}.`
          : "Automatic backups have been disabled.",
      })
    } catch (error) {
      console.error("Error saving backup settings:", error)
      toast({
        title: "Error saving settings",
        description: "There was an error saving your backup settings.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Clock className="h-4 w-4 mr-2" />
          Schedule Backups
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Auto Backup Settings</DialogTitle>
          <DialogDescription>Configure automatic daily backups of your fitness data.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-backup" className="flex flex-col gap-1">
              <span>Enable Auto Backup</span>
              <span className="font-normal text-xs text-muted-foreground">
                Automatically back up your data once a day
              </span>
            </Label>
            <Switch id="auto-backup" checked={autoBackupEnabled} onCheckedChange={setAutoBackupEnabled} />
          </div>

          {autoBackupEnabled && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="backup-time">Backup Time</Label>
                <Select value={backupTime} onValueChange={setBackupTime}>
                  <SelectTrigger id="backup-time">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <SelectItem key={hour} value={`${hour.toString().padStart(2, "0")}:00`}>
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label className="mb-1">Backup Destinations</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-to-device"
                    checked={saveToDevice}
                    onCheckedChange={(checked) => setSaveToDevice(checked === true)}
                  />
                  <Label htmlFor="save-to-device" className="text-sm font-normal">
                    Save to device (JSON & CSV)
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dropbox"
                    checked={cloudServices.includes("dropbox")}
                    onCheckedChange={() => toggleCloudService("dropbox")}
                  />
                  <Label htmlFor="dropbox" className="text-sm font-normal">
                    Sync to Dropbox
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="google-drive"
                    checked={cloudServices.includes("google-drive")}
                    onCheckedChange={() => toggleCloudService("google-drive")}
                  />
                  <Label htmlFor="google-drive" className="text-sm font-normal">
                    Sync to Google Drive
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onedrive"
                    checked={cloudServices.includes("onedrive")}
                    onCheckedChange={() => toggleCloudService("onedrive")}
                  />
                  <Label htmlFor="onedrive" className="text-sm font-normal">
                    Sync to OneDrive
                  </Label>
                </div>

                {!saveToDevice && cloudServices.length === 0 && (
                  <p className="text-xs text-destructive mt-2">Please select at least one backup destination.</p>
                )}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={saveSettings} disabled={autoBackupEnabled && !saveToDevice && cloudServices.length === 0}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

