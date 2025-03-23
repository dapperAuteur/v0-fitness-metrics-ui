"use client"

import { useState } from "react"
import { Cell, Tooltip, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"

// Sample data for the training types chart
const data = [
  { name: "Strength", value: 35, color: "#3b82f6" },
  { name: "Cardio", value: 25, color: "#10b981" },
  { name: "Flexibility", value: 15, color: "#f59e0b" },
  { name: "HIIT", value: 15, color: "#ef4444" },
  { name: "Other", value: 10, color: "#8b5cf6" },
]

export function TrainingTypesChart() {
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
          innerRadius={0}
          outerRadius={70}
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
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconSize={10}
          iconType="circle"
          formatter={(value, entry) => <span style={{ color: entry.color, marginRight: 10 }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

