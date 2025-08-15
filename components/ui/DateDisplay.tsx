"use client";

import React from "react";
import moment from "moment";

interface DateDisplayProps {
  date: string | Date | moment.Moment;
  format?: string;
  className?: string;
  showRelative?: boolean;
  prefix?: string;
  suffix?: string;
}

/**
 * A reusable component for displaying formatted dates using moment.js
 */
export function DateDisplay({
  date,
  format = "MMMM D, YYYY",
  className = "",
  showRelative = false,
  prefix = "",
  suffix = "",
}: DateDisplayProps) {
  if (!date) return null;

  const formattedDate = showRelative
    ? moment(date).fromNow()
    : moment(date).format(format);

  return (
    <time
      dateTime={moment(date).toISOString()}
      className={className}
      title={
        showRelative ? moment(date).format("MMMM D, YYYY, h:mm A") : undefined
      }
    >
      {prefix}
      {formattedDate}
      {suffix}
    </time>
  );
}

/**
 * Shows how long ago a date occurred
 */
export function TimeAgo({
  date,
  className = "",
  prefix = "",
  suffix = "",
}: Omit<DateDisplayProps, "format" | "showRelative">) {
  return (
    <DateDisplay
      date={date}
      showRelative={true}
      className={className}
      prefix={prefix}
      suffix={suffix}
    />
  );
}

/**
 * Shows a countdown to a future date
 */
export function Countdown({
  date,
  className = "",
  endText = "Ended",
}: Omit<DateDisplayProps, "format" | "showRelative" | "prefix" | "suffix"> & {
  endText?: string;
}) {
  const [timeLeft, setTimeLeft] = React.useState("");

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const now = moment();
      const target = moment(date);
      const diff = target.diff(now);

      if (diff <= 0) {
        setTimeLeft(endText);
        return;
      }

      const duration = moment.duration(diff);
      const days = Math.floor(duration.asDays());
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timerId);
  }, [date, endText]);

  return <time className={className}>{timeLeft}</time>;
}
