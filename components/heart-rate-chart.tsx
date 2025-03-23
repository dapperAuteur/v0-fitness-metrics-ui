"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { HeartRateData } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HeartRateChartProps {
  data: HeartRateData[]
}

export default function HeartRateChart({ data }: HeartRateChartProps) {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>
  }

  // Filter out any undefined entries and map to chart format
  const chartData = data
    .filter((day) => day && day.shortDate)
    .map((day) => ({
      name: day.shortDate,
      maxHR: day.maxHR,
      restingHR: day.restingHR,
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
        maxHR: {
          label: "Max HR",
          color: "hsl(var(--chart-1))",
        },
        restingHR: {
          label: "Resting HR",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[30, 220]} tickCount={6} />
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
          <Line
            type="monotone"
            dataKey="maxHR"
            stroke="var(--color-maxHR)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="restingHR"
            stroke="var(--color-restingHR)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

