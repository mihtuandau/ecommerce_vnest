import dayjs from "@/lib/dayjs";

/**
 * Format a date string for display.
 * @example formatDate("2024-01-15T10:30:00Z") => "15/01/2024"
 */
export function formatDate(date: string | Date, format: string = "DD/MM/YYYY"): string {
  return dayjs(date).format(format);
}

/**
 * Format a date as relative time.
 * @example formatRelativeDate("2024-01-15T10:30:00Z") => "3 ngày trước"
 */
export function formatRelativeDate(date: string | Date): string {
  return dayjs(date).fromNow();
}

/**
 * Get time left until a specific end date
 */
export function getTimeLeft(endDate: string) {
  const total = Date.parse(endDate) - Date.parse(new Date().toString());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    expired: total <= 0,
  };
}
