"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { StepsData } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface StepsChartProps {
  data: StepsData[]
}

export default function StepsChart({ data }: StepsChartProps) {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>
  }

  // Filter out any undefined entries and map to chart format
  const chartData = data
    .filter((day) => day && day.shortDate)
    .map((day) => ({
      name: day.shortDate,
      steps: day.steps,
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
        steps: {
          label: "Steps",
          color: "hsl(var(--chart-1))",
        },
      }}
      className="h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax"]} tickCount={6} />
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
          <Bar dataKey="steps" fill="var(--color-steps)" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

