/**
 * Convert data to CSV format
 */
export function convertToCSV(data: any): string {
  // Handle different data types
  if (Array.isArray(data)) {
    // If it's an array of objects (like sleep data or heart rate data)
    if (data.length === 0) return ""

    // Determine headers based on the first object
    const firstItem = data[0]
    const headers = Object.keys(firstItem)

    // Create CSV content with headers
    const csvContent = [
      headers.join(","),
      ...data.map((item) => {
        return headers
          .map((header) => {
            const value = item[header]

            // Format dates
            if (header === "date" && value instanceof Date) {
              return value.toISOString().split("T")[0]
            }

            // Handle strings with commas
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`
            }

            return value
          })
          .join(",")
      }),
    ].join("\n")

    return csvContent
  } else if (typeof data === "object" && data !== null) {
    // If it's a complex object with multiple data types
    const csvParts = []

    // Process each data type
    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value) && value.length > 0) {
        // Add a section header
        csvParts.push(`# ${key.toUpperCase()} DATA`)
        csvParts.push("")

        // Add the CSV for this data type
        csvParts.push(convertToCSV(value))
        csvParts.push("\n")
      }
    }

    return csvParts.join("\n")
  }

  // Fallback for unsupported data types
  return "Unsupported data format"
}

/**
 * Convert data to JSON format
 */
export function convertToJSON(data: any): string {
  // Create a simplified version of the data for export
  if (Array.isArray(data)) {
    const exportData = data.map((item) => {
      const result: Record<string, any> = {}

      for (const [key, value] of Object.entries(item)) {
        if (key === "date" && value instanceof Date) {
          result[key] = value.toISOString().split("T")[0]
        } else {
          result[key] = value
        }
      }

      return result
    })

    return JSON.stringify(exportData, null, 2)
  }

  // For complex objects, just stringify with formatting
  return JSON.stringify(
    data,
    (key, value) => {
      if (key === "date" && value instanceof Date) {
        return value.toISOString().split("T")[0]
      }
      return value
    },
    2,
  )
}

/**
 * Download data as a file
 */
export function downloadFile(content: string, fileName: string, contentType: string): void {
  if (typeof window === "undefined") return

  // Create a blob with the data
  const blob = new Blob([content], { type: contentType })

  // Create a URL for the blob
  const url = URL.createObjectURL(blob)

  // Create a temporary link element
  const link = document.createElement("a")
  link.href = url
  link.download = fileName

  // Trigger the download
  document.body.appendChild(link)
  link.click()

  // Clean up
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Generate a timestamp for file names
 */
export function getTimestamp(): string {
  const now = new Date()
  return now.toISOString().replace(/[:.]/g, "-").split("T")[0]
}

/**
 * Get service name for display
 */
export function getServiceName(service: string): string {
  switch (service) {
    case "dropbox":
      return "Dropbox"
    case "google-drive":
      return "Google Drive"
    case "onedrive":
      return "OneDrive"
    default:
      return service
  }
}

