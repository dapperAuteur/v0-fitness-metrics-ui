"use client"

import { useState } from "react"
import { Cell, Tooltip, Pie, PieChart, ResponsiveContainer } from "recharts"

// Sample data for the training intensity heatmap
const data = [
  { name: "Light (RPE 1-3)", value: 30, color: "#93c5fd" },
  { name: "Moderate (RPE 4-6)", value: 45, color: "#3b82f6" },
  { name: "Intense (RPE 7-8)", value: 20, color: "#1d4ed8" },
  { name: "Maximum (RPE 9-10)", value: 5, color: "#1e3a8a" },
]

export function TrainingIntensityHeatmap() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke={activeIndex === index ? "#fff" : "transparent"}
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          formatter={(value) => [`${value}%`, "Percentage"]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

