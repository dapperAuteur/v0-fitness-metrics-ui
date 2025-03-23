"use client"

import { useState, useRef } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus, Mic, Video, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { type SmallWin, SMALL_WIN_TAGS } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Define the form schema with validation
const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  tag: z.string().min(1, "Please select a tag"),
  content: z.string().min(1, "Content is required"),
  mediaType: z.enum(["text", "audio", "video"]),
  mediaUrl: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddSmallWinFormProps {
  onAddData: (data: SmallWin) => void
}

export default function AddSmallWinForm({ onAddData }: AddSmallWinFormProps) {
  const [open, setOpen] = useState(false)
  const [recordingAudio, setRecordingAudio] = useState(false)
  const [recordingVideo, setRecordingVideo] = useState(false)
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)
  const audioRef = useRef<MediaRecorder | null>(null)
  const videoRef = useRef<MediaRecorder | null>(null)
  const mediaChunks = useRef<BlobPart[]>([])
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      title: "",
      tag: "",
      content: "",
      mediaType: "text",
    },
  })

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      audioRef.current = mediaRecorder
      mediaChunks.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunks.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(mediaChunks.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        setMediaBlob(blob)
        setMediaUrl(url)
        form.setValue("mediaType", "audio")
        form.setValue("mediaUrl", url)
        setRecordingAudio(false)
      }

      mediaRecorder.start()
      setRecordingAudio(true)
    } catch (error) {
      console.error("Error starting audio recording:", error)
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop audio recording
  const stopAudioRecording = () => {
    if (audioRef.current && recordingAudio) {
      audioRef.current.stop()
      audioRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  // Start video recording
  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      videoRef.current = mediaRecorder
      mediaChunks.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          mediaChunks.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(mediaChunks.current, { type: "video/webm" })
        const url = URL.createObjectURL(blob)
        setMediaBlob(blob)
        setMediaUrl(url)
        form.setValue("mediaType", "video")
        form.setValue("mediaUrl", url)
        setRecordingVideo(false)
      }

      mediaRecorder.start()
      setRecordingVideo(true)
    } catch (error) {
      console.error("Error starting video recording:", error)
      toast({
        title: "Recording Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  // Stop video recording
  const stopVideoRecording = () => {
    if (videoRef.current && recordingVideo) {
      videoRef.current.stop()
      videoRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  // Clear media
  const clearMedia = () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl)
    }
    setMediaBlob(null)
    setMediaUrl(null)
    form.setValue("mediaType", "text")
    form.setValue("mediaUrl", undefined)
  }

  // Handle form submission
  function onSubmit(values: FormValues) {
    // Create a unique ID for the small win
    const id = uuidv4()

    // Format the date
    const dateString = format(values.date, "EEE, MMM d, yyyy")

    // Create the small win object
    const smallWin: SmallWin = {
      id,
      date: values.date,
      dateString,
      title: values.title,
      tag: values.tag,
      content: values.content,
      mediaType: values.mediaType,
      mediaUrl: values.mediaUrl,
    }

    // Submit the data to the parent component
    onAddData(smallWin)

    // Show success message
    toast({
      title: "Small Win added",
      description: `Your small win "${values.title}" has been added.`,
    })

    // Reset form and close dialog
    form.reset()
    clearMedia()
    setOpen(false)
  }

  // Clean up when dialog closes
  const handleDialogChange = (open: boolean) => {
    if (!open) {
      stopAudioRecording()
      stopVideoRecording()
      if (!form.formState.isSubmitSuccessful) {
        clearMedia()
      }
    }
    setOpen(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Small Win
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add a Small Win</DialogTitle>
          <DialogDescription>Record your achievements, no matter how small.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tag" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SMALL_WIN_TAGS.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Give your small win a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your small win..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Media (Optional)</FormLabel>
              <div className="flex gap-2">
                {!mediaUrl && !recordingAudio && !recordingVideo && (
                  <>
                    <Button type="button" variant="outline" onClick={startAudioRecording} className="gap-2">
                      <Mic className="h-4 w-4" />
                      Record Audio
                    </Button>
                    <Button type="button" variant="outline" onClick={startVideoRecording} className="gap-2">
                      <Video className="h-4 w-4" />
                      Record Video
                    </Button>
                  </>
                )}

                {recordingAudio && (
                  <Button type="button" variant="destructive" onClick={stopAudioRecording} className="gap-2">
                    <span className="animate-pulse">●</span>
                    Stop Recording
                  </Button>
                )}

                {recordingVideo && (
                  <Button type="button" variant="destructive" onClick={stopVideoRecording} className="gap-2">
                    <span className="animate-pulse">●</span>
                    Stop Recording
                  </Button>
                )}

                {mediaUrl && (
                  <div className="flex flex-col gap-2 w-full">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {form.getValues("mediaType") === "audio" ? "Audio" : "Video"} Recorded
                      </span>
                      <Button type="button" variant="ghost" size="sm" onClick={clearMedia} className="h-8 w-8 p-0">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {form.getValues("mediaType") === "audio" && <audio src={mediaUrl} controls className="w-full" />}
                    {form.getValues("mediaType") === "video" && (
                      <video src={mediaUrl} controls className="w-full max-h-[200px]" />
                    )}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">Save Small Win</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

