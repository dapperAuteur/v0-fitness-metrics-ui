"use client"

import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, Plus } from "lucide-react"

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Define the form schema with validation
const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date.",
  }),
  maxHR: z
    .number({
      required_error: "Please enter your maximum heart rate.",
    })
    .min(100, "Max HR must be at least 100")
    .max(250, "Max HR must be at most 250"),
  restingHR: z
    .number({
      required_error: "Please enter your resting heart rate.",
    })
    .min(30, "Resting HR must be at least 30")
    .max(120, "Resting HR must be at most 120"),
  hrv: z
    .number({
      required_error: "Please enter your heart rate variability.",
    })
    .min(10, "HRV must be at least 10")
    .max(150, "HRV must be at most 150"),
})

type FormValues = z.infer<typeof formSchema>

interface AddHeartRateFormProps {
  onAddData: (data: {
    date: Date
    maxHR: number
    restingHR: number
    hrv: number
  }) => void
}

export default function AddHeartRateForm({ onAddData }: AddHeartRateFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      maxHR: 180,
      restingHR: 60,
      hrv: 50,
    },
  })

  // Handle form submission
  function onSubmit(values: FormValues) {
    // Submit the data to the parent component
    onAddData({
      date: values.date,
      maxHR: values.maxHR,
      restingHR: values.restingHR,
      hrv: values.hrv,
    })

    // Show success message
    toast({
      title: "Heart rate data added",
      description: `Heart rate data for ${format(values.date, "EEEE, MMMM d")} has been added.`,
    })

    // Reset form and close dialog
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Heart Rate Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Heart Rate Data</DialogTitle>
          <DialogDescription>Enter your heart rate metrics for a specific date.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="maxHR"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Heart Rate (bpm)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={100}
                        max={250}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">100</span>
                        <span className="text-sm font-medium">{field.value} bpm</span>
                        <span className="text-xs text-muted-foreground">250</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="restingHR"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resting Heart Rate (bpm)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={30}
                        max={120}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">30</span>
                        <span className="text-sm font-medium">{field.value} bpm</span>
                        <span className="text-xs text-muted-foreground">120</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hrv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heart Rate Variability (ms)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={10}
                        max={150}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">10</span>
                        <span className="text-sm font-medium">{field.value} ms</span>
                        <span className="text-xs text-muted-foreground">150</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Save Data</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

