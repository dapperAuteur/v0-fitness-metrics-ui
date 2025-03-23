"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

// Sample data for correlation analysis
const data = [
  { metric: "Recognition Frequency", correlation: 0.86, color: "#3b82f6" },
  { metric: "Training Duration", correlation: 0.72, color: "#3b82f6" },
  { metric: "Exercise Frequency", correlation: 0.65, color: "#3b82f6" },
  { metric: "Sleep Quality", correlation: 0.58, color: "#3b82f6" },
  { metric: "Nutrition Quality", correlation: 0.52, color: "#3b82f6" },
  { metric: "Training Intensity", correlation: 0.43, color: "#3b82f6" },
  { metric: "Training Types", correlation: 0.31, color: "#3b82f6" },
]

// Sort data by correlation value in descending order
const sortedData = [...data].sort((a, b) => b.correlation - a.correlation)

// Assign colors based on correlation strength
const getCorrelationColor = (correlation: number) => {
  if (correlation >= 0.7) return "#10b981" // Strong (green)
  if (correlation >= 0.5) return "#f59e0b" // Moderate (yellow)
  return "#ef4444" // Weak (red)
}

// Update colors based on correlation strength
const coloredData = sortedData.map((item) => ({
  ...item,
  color: getCorrelationColor(item.correlation),
}))

export function CorrelationAnalysis() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={coloredData} layout="vertical" margin={{ top: 20, right: 30, left: 120, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
            tickCount={6}
          />
          <YAxis type="category" dataKey="metric" tick={{ fontSize: 12 }} width={120} />
          <Tooltip
            formatter={(value) => [`${(Number(value) * 100).toFixed(0)}%`, "Correlation"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #e0e0e0",
              borderRadius: "4px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          />
          <Bar dataKey="correlation" radius={[0, 4, 4, 0]}>
            {coloredData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

