import type React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  bgStrokeWidth?: number
  progressClassName?: string
  bgClassName?: string
  textClassName?: string
  showText?: boolean
}

export function CircularProgress({
  value,
  size = 100,
  strokeWidth = 10,
  bgStrokeWidth = 10,
  progressClassName,
  bgClassName,
  textClassName,
  showText = true,
}: CircularProgressProps) {
  // Ensure value is between 0 and 100
  const progress = Math.min(Math.max(value, 0), 100)

  // Calculate radius and circumference
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  // Center coordinates
  const center = size / 2

  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="absolute">
        <circle
          className={cn("transition-all duration-300", bgClassName)}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={bgStrokeWidth}
        />
      </svg>

      {/* Progress circle */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gradient-start, #3b82f6)" />
            <stop offset="100%" stopColor="var(--gradient-end, #60a5fa)" />
          </linearGradient>
        </defs>
        <circle
          className={cn("transition-all duration-300", progressClassName)}
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={
            {
              stroke: progressClassName?.includes("stroke-gradient") ? "url(#gradient)" : undefined,
              "--gradient-start": "var(--start-color, #3b82f6)",
              "--gradient-end": "var(--end-color, #60a5fa)",
            } as React.CSSProperties
          }
        />
      </svg>

      {/* Text in the center */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-foreground", textClassName)}>{progress}%</span>
        </div>
      )}
    </div>
  )
}

