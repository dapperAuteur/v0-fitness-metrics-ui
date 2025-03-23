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
import { Input } from "@/components/ui/input"
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
  sleepScore: z
    .number({
      required_error: "Please enter a sleep score.",
    })
    .min(0, "Score must be at least 0")
    .max(100, "Score must be at most 100"),
  sleepHours: z
    .number({
      required_error: "Please enter sleep hours.",
    })
    .min(0, "Hours must be at least 0")
    .max(24, "Hours must be at most 24"),
  sleepMinutes: z
    .number({
      required_error: "Please enter sleep minutes.",
    })
    .min(0, "Minutes must be at least 0")
    .max(59, "Minutes must be at most 59"),
})

type FormValues = z.infer<typeof formSchema>

interface AddSleepDataFormProps {
  onAddData: (data: {
    date: Date
    sleepScore: number
    sleepHours: string
    sleepMinutes: number
  }) => void
}

export default function AddSleepDataForm({ onAddData }: AddSleepDataFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      sleepScore: 75,
      sleepHours: 7,
      sleepMinutes: 30,
    },
  })

  // Handle form submission
  function onSubmit(values: FormValues) {
    // Calculate total sleep time in hours (with decimal)
    const totalSleepHours = values.sleepHours + values.sleepMinutes / 60

    // Submit the data to the parent component
    onAddData({
      date: values.date,
      sleepScore: values.sleepScore,
      sleepHours: totalSleepHours.toFixed(1),
      sleepMinutes: values.sleepHours * 60 + values.sleepMinutes,
    })

    // Show success message
    toast({
      title: "Sleep data added",
      description: `Sleep data for ${format(values.date, "EEEE, MMMM d")} has been added.`,
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
          Add Sleep Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Sleep Data</DialogTitle>
          <DialogDescription>Enter your sleep metrics for a specific date.</DialogDescription>
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
              name="sleepScore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sleep Score (0-100)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">Poor</span>
                        <span className="text-sm font-medium">{field.value}</span>
                        <span className="text-xs text-muted-foreground">Excellent</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sleepHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hours</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={24}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sleepMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minutes</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={59}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="submit">Save Data</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

