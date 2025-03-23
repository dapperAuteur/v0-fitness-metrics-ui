"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for the training duration chart
const data = [
  { day: "Mon", minutes: 45 },
  { day: "Tue", minutes: 60 },
  { day: "Wed", minutes: 30 },
  { day: "Thu", minutes: 75 },
  { day: "Fri", minutes: 45 },
  { day: "Sat", minutes: 90 },
  { day: "Sun", minutes: 0 },
]

export function TrainingDurationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `${value}m`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`${value} minutes`, "Duration"]}
          labelFormatter={(label) => `${label}`}
        />
        <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}

