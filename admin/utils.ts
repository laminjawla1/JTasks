type DateFormatStyle = "full" | "dateOnly" | "timeOnly" | "relative"

interface FormatOptions {
  style?: DateFormatStyle
  locale?: string
  timeZone?: string
}

/**
 * Formats an ISO 8601 timestamp string into a human-readable format.
 * Example input: "2026-11-23T15:15:13.202599Z"
 */
export function formatTimestamp(
  isoString: string | null | undefined,
  options: FormatOptions = {}
): string {
  if (!isoString) return "N/A"

  const date = new Date(isoString)

  // Guard against invalid date strings
  if (Number.isNaN(date.getTime())) {
    console.warn(`Invalid timestamp provided: ${isoString}`)
    return "Invalid Date"
  }

  const { style = "full", locale = "en-US", timeZone } = options

  switch (style) {
    case "dateOnly":
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone,
      }).format(date)

    case "timeOnly":
      return new Intl.DateTimeFormat(locale, {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        timeZone,
      }).format(date)

    case "relative":
      return getRelativeTime(date, locale)

    case "full":
    default:
      return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone,
      }).format(date)
  }
}

/**
 * Helper to return relative time (e.g., "2 days ago", "in 5 minutes")
 */
function getRelativeTime(date: Date, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" })
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000)

  const units: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ]

  for (const { unit, seconds } of units) {
    if (Math.abs(diffInSeconds) >= seconds || unit === "second") {
      return rtf.format(Math.round(diffInSeconds / seconds), unit)
    }
  }

  return ""
}
