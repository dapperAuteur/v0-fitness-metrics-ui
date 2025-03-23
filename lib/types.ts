// Type definition for sleep data
export interface SleepData {
  date: Date
  dateString: string
  shortDate: string
  sleepScore: number
  sleepHours: string
  sleepMinutes: number
}

// Type definition for heart rate data
export interface HeartRateData {
  date: Date
  dateString: string
  shortDate: string
  maxHR: number
  restingHR: number
  hrv: number
}

// Type definition for steps data
export interface StepsData {
  date: Date
  dateString: string
  shortDate: string
  steps: number
  distance: number // in kilometers
  calories: number
  activeMinutes: number
}

// Type definition for small wins data
export interface SmallWin {
  id: string
  date: Date
  dateString: string
  title: string
  tag: string
  content: string
  mediaType: "text" | "audio" | "video"
  mediaUrl?: string
}

// Available tags for small wins
export const SMALL_WIN_TAGS = [
  "Fitness",
  "Nutrition",
  "Mental Health",
  "Sleep",
  "Work",
  "Personal",
  "Relationship",
  "Other",
] as const

export type SmallWinTag = (typeof SMALL_WIN_TAGS)[number]

