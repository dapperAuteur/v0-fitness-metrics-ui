"use client"

import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import type { HeartRateData } from "@/lib/types"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface HRVChartProps {
  data: HeartRateData[]
}

export default function HRVChart({ data }: HRVChartProps) {
  // Check if data is empty or undefined
  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-muted-foreground">No data available</div>
  }

  // Filter out any undefined entries and map to chart format
  const chartData = data
    .filter((day) => day && day.shortDate)
    .map((day) => ({
      name: day.shortDate,
      hrv: day.hrv,
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
        hrv: {
          label: "HRV",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[250px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[10, 150]} tickCount={5} />
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
          <Area type="monotone" dataKey="hrv" stroke="var(--color-hrv)" fill="var(--color-hrv)" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

