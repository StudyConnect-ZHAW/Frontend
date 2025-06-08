/**
 * Formats a given date into a short relative time string.
 *
 * The output uses shorthand suffixes:
 * - "m" for minutes (e.g., "45m")
 * - "h" for hours (e.g., "3h")
 * - "d" for days (e.g., "12d")
 * - "mo" for months (e.g., "5mo")
 * - "y" for years (e.g., "2y")
 *
 * This function uses approximate conversions:
 * - 1 month = 30 days
 * - 1 year = 12 months
 *
 * @param date - The date to compare against the current time.
 * @returns A string representing the relative time from now.
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  // Calculate total difference in minutes
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // Show minutes if under 1 hour
  if (diffMinutes < 60) {
    return `${diffMinutes}m`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  // Show hours if under 24 hours
  if (diffHours < 24) {
    return `${diffHours}h`;
  }

  const diffDays = Math.floor(diffHours / 24);

  // Show days if under 30 days
  if (diffDays < 30) {
    return `${diffDays}d`;
  }

  const diffMonths = Math.floor(diffDays / 30);

  // Show months if under 12 months
  if (diffMonths < 12) {
    return `${diffMonths}mo`;
  }

  const diffYears = Math.floor(diffDays / 365);

  // Show years otherwise
  return `${diffYears}y`;
}