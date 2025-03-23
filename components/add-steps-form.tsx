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
  steps: z
    .number({
      required_error: "Please enter your step count.",
    })
    .min(0, "Steps must be at least 0")
    .max(100000, "Steps must be at most 100,000"),
  distance: z
    .number({
      required_error: "Please enter distance walked.",
    })
    .min(0, "Distance must be at least 0")
    .max(100, "Distance must be at most 100 km"),
  calories: z
    .number({
      required_error: "Please enter calories burned.",
    })
    .min(0, "Calories must be at least 0")
    .max(10000, "Calories must be at most 10,000"),
  activeMinutes: z
    .number({
      required_error: "Please enter active minutes.",
    })
    .min(0, "Active minutes must be at least 0")
    .max(1440, "Active minutes must be at most 1,440 (24 hours)"),
})

type FormValues = z.infer<typeof formSchema>

interface AddStepsFormProps {
  onAddData: (data: {
    date: Date
    steps: number
    distance: number
    calories: number
    activeMinutes: number
  }) => void
}

export default function AddStepsForm({ onAddData }: AddStepsFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      steps: 8000,
      distance: 5.2,
      calories: 320,
      activeMinutes: 45,
    },
  })

  // Handle form submission
  function onSubmit(values: FormValues) {
    // Submit the data to the parent component
    onAddData({
      date: values.date,
      steps: values.steps,
      distance: values.distance,
      calories: values.calories,
      activeMinutes: values.activeMinutes,
    })

    // Show success message
    toast({
      title: "Steps data added",
      description: `Steps data for ${format(values.date, "EEEE, MMMM d")} has been added.`,
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
          Add Steps Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Steps Data</DialogTitle>
          <DialogDescription>Enter your daily steps and activity metrics.</DialogDescription>
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
              name="steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Steps</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={0}
                        max={30000}
                        step={100}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                      <div className="flex justify-between">
                        <span className="text-xs text-muted-foreground">0</span>
                        <span className="text-sm font-medium">{field.value.toLocaleString()} steps</span>
                        <span className="text-xs text-muted-foreground">30,000</span>
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
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance (km)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        min={0}
                        max={100}
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
                name="calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={10000}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="activeMinutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Active Minutes</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      max={1440}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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

