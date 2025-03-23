"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SleepData {
  date: Date
  dateString: string
  shortDate: string
  sleepScore: number
  sleepHours: string
  sleepMinutes: number
}

interface SleepTimeChartProps {
  data: SleepData[]
}

export default function SleepTimeChart({ data }: SleepTimeChartProps) {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>
  }

  // Filter out any undefined entries and map to chart format
  const chartData = data
    .filter((day) => day && day.shortDate && day.sleepHours)
    .map((day) => ({
      name: day.shortDate,
      hours: Number.parseFloat(day.sleepHours),
      fullDate: day.dateString,
    }))

  // If we still have no valid data after filtering
  if (chartData.length === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-muted-foreground">No valid data available</div>
    )
  }

  return (
    <ChartContainer
      config={{
        hours: {
          label: "Hours",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[5, 9]} tickCount={5} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    // @ts-ignore - payload type is correct at runtime
                    return payload[0].payload.fullDate
                  }
                  return label
                }}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="var(--color-hours)"
            fill="var(--color-hours)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

