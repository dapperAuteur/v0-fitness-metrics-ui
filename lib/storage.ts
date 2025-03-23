// Storage utility functions for the fitness metrics app

/**
 * Save data to localStorage
 */
export function saveDataToLocalStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return

  try {
    // Convert Date objects to ISO strings for proper serialization
    const serializedData = JSON.stringify(data, (key, value) => {
      if (key === "date" && value instanceof Date) {
        return value.toISOString()
      }
      return value
    })

    localStorage.setItem(key, serializedData)
  } catch (error) {
    console.error(`Error saving data to localStorage (${key}):`, error)
  }
}

/**
 * Load data from localStorage
 */
export function loadDataFromLocalStorage<T>(key: string): T[] | null {
  if (typeof window === "undefined") return null

  try {
    const data = localStorage.getItem(key)

    if (!data) return null

    // Parse the data and convert ISO date strings back to Date objects
    const parsedData = JSON.parse(data, (key, value) => {
      if (key === "date" && typeof value === "string") {
        const date = new Date(value)
        // Verify the date is valid
        return isNaN(date.getTime()) ? null : date
      }
      return value
    })

    // Validate the parsed data is an array
    if (!Array.isArray(parsedData)) {
      console.error(`Data loaded from ${key} is not an array`)
      return null
    }

    // Filter out any items with invalid dates
    return parsedData.filter(
      (item) =>
        item &&
        typeof item === "object" &&
        item.date !== null &&
        (item.date instanceof Date || !isNaN(new Date(item.date).getTime())),
    )
  } catch (error) {
    console.error(`Error loading data from localStorage (${key}):`, error)
    return null
  }
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === "undefined") return false

  try {
    const testKey = "__storage_test__"
    localStorage.setItem(testKey, testKey)
    localStorage.removeItem(testKey)
    return true
  } catch (e) {
    return false
  }
}

