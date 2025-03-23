"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

// Sample data for the exercise frequency chart
const data = [
  { day: "1", sessions: 1 },
  { day: "2", sessions: 1 },
  { day: "3", sessions: 0 },
  { day: "4", sessions: 1 },
  { day: "5", sessions: 1 },
  { day: "6", sessions: 2 },
  { day: "7", sessions: 0 },
  { day: "8", sessions: 1 },
  { day: "9", sessions: 1 },
  { day: "10", sessions: 0 },
  { day: "11", sessions: 1 },
  { day: "12", sessions: 2 },
  { day: "13", sessions: 1 },
  { day: "14", sessions: 0 },
]

export function ExerciseFrequencyChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#e0e0e0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => {
            // Only show every 2nd label to avoid crowding
            const index = Number.parseInt(value) - 1
            return index % 2 === 0 ? value : ""
          }}
        />
        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} domain={[0, 2]} ticks={[0, 1, 2]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`${value} session${value !== 1 ? "s" : ""}`, "Frequency"]}
          labelFormatter={(label) => `Day ${label}`}
        />
        <Line
          type="monotone"
          dataKey="sessions"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4, fill: "#3b82f6", stroke: "#fff", strokeWidth: 1 }}
          activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

