import moment from "moment";

/**
 * Date utilities using moment.js
 */

/**
 * Format a date in the standard display format
 * @param date Date to format (string, Date, or moment object)
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | moment.Moment): string => {
  return moment(date).format("MMMM D, YYYY");
};

/**
 * Format a date with time
 * @param date Date to format (string, Date, or moment object)
 * @returns Formatted date and time string
 */
export const formatDateTime = (date: string | Date | moment.Moment): string => {
  return moment(date).format("MMMM D, YYYY, h:mm A");
};

/**
 * Format a date as a relative time (e.g. "2 days ago")
 * @param date Date to format (string, Date, or moment object)
 * @returns Relative time string
 */
export const formatRelativeTime = (
  date: string | Date | moment.Moment
): string => {
  return moment(date).fromNow();
};

/**
 * Get the difference between two dates in days
 * @param date1 First date
 * @param date2 Second date (defaults to now)
 * @returns Number of days difference
 */
export const getDaysDifference = (
  date1: string | Date | moment.Moment,
  date2: string | Date | moment.Moment = new Date()
): number => {
  return moment(date1).diff(moment(date2), "days");
};

/**
 * Check if a date is in the past
 * @param date Date to check
 * @returns True if the date is in the past
 */
export const isPast = (date: string | Date | moment.Moment): boolean => {
  return moment(date).isBefore(moment());
};

/**
 * Check if a date is in the future
 * @param date Date to check
 * @returns True if the date is in the future
 */
export const isFuture = (date: string | Date | moment.Moment): boolean => {
  return moment(date).isAfter(moment());
};

/**
 * Add a specified amount of time to a date
 * @param date Base date
 * @param amount Amount to add
 * @param unit Unit of time (days, months, etc.)
 * @returns New moment object with added time
 */
export const addTime = (
  date: string | Date | moment.Moment,
  amount: number,
  unit: moment.DurationInputArg2
): moment.Moment => {
  return moment(date).add(amount, unit);
};

/**
 * Format a duration between two dates
 * @param startDate Start date
 * @param endDate End date (defaults to now)
 * @returns Formatted duration string
 */
export const formatDuration = (
  startDate: string | Date | moment.Moment,
  endDate: string | Date | moment.Moment = new Date()
): string => {
  const start = moment(startDate);
  const end = moment(endDate);
  const duration = moment.duration(end.diff(start));

  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const minutes = duration.minutes();

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};
