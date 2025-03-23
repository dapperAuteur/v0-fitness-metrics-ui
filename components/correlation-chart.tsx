"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts"

// Sample data for the correlation chart
const data = [
  { date: "Jan 1", recognition: 45, recovery: 72 },
  { date: "Jan 2", recognition: 52, recovery: 75 },
  { date: "Jan 3", recognition: 48, recovery: 73 },
  { date: "Jan 4", recognition: 61, recovery: 78 },
  { date: "Jan 5", recognition: 55, recovery: 76 },
  { date: "Jan 6", recognition: 67, recovery: 82 },
  { date: "Jan 7", recognition: 72, recovery: 85 },
  { date: "Jan 8", recognition: 69, recovery: 83 },
  { date: "Jan 9", recognition: 74, recovery: 86 },
  { date: "Jan 10", recognition: 71, recovery: 84 },
  { date: "Jan 11", recognition: 65, recovery: 80 },
  { date: "Jan 12", recognition: 59, recovery: 77 },
  { date: "Jan 13", recognition: 63, recovery: 79 },
  { date: "Jan 14", recognition: 68, recovery: 82 },
  { date: "Jan 15", recognition: 75, recovery: 87 },
  { date: "Jan 16", recognition: 79, recovery: 89 },
  { date: "Jan 17", recognition: 76, recovery: 88 },
  { date: "Jan 18", recognition: 80, recovery: 90 },
  { date: "Jan 19", recognition: 82, recovery: 91 },
  { date: "Jan 20", recognition: 78, recovery: 89 },
  { date: "Jan 21", recognition: 73, recovery: 86 },
  { date: "Jan 22", recognition: 70, recovery: 84 },
  { date: "Jan 23", recognition: 67, recovery: 82 },
  { date: "Jan 24", recognition: 65, recovery: 80 },
  { date: "Jan 25", recognition: 68, recovery: 83 },
  { date: "Jan 26", recognition: 72, recovery: 85 },
  { date: "Jan 27", recognition: 75, recovery: 87 },
  { date: "Jan 28", recognition: 79, recovery: 89 },
  { date: "Jan 29", recognition: 82, recovery: 91 },
  { date: "Jan 30", recognition: 85, recovery: 93 },
]

export function CorrelationChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
          tickFormatter={(value) => {
            // Only show every 5th label to avoid crowding
            const index = data.findIndex((item) => item.date === value)
            return index % 5 === 0 ? value : ""
          }}
        />
        <YAxis
          yAxisId="left"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
          domain={[40, 100]}
          label={{
            value: "Recognition %",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle", fontSize: 12, fill: "#666" },
          }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#e0e0e0" }}
          domain={[40, 100]}
          label={{
            value: "Recovery Score",
            angle: 90,
            position: "insideRight",
            style: { textAnchor: "middle", fontSize: 12, fill: "#666" },
          }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value, name) => {
            return [value, name === "recognition" ? "Recognition %" : "Recovery Score"]
          }}
        />
        <Legend
          verticalAlign="top"
          height={36}
          formatter={(value) => {
            return value === "recognition" ? "Recognition %" : "Recovery Score"
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="recognition"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 0 }}
          activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 1, fill: "#fff" }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="recovery"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 0 }}
          activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 1, fill: "#fff" }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

