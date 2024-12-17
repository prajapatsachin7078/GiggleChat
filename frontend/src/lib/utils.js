import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export const formatTimestamp = (createdAt) => {
  const date = new Date(createdAt);

  // If the message was sent today, show only the time (e.g., "12:30 PM")
  if (format(date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")) {
    return format(date, "hh:mm a");
  }

  // Otherwise, display "Yesterday, hh:mm a" or the full date
  const isYesterday =
    format(date, "yyyy-MM-dd") ===
    format(new Date(Date.now() - 86400000), "yyyy-MM-dd");
  return isYesterday
    ? `Yesterday, ${format(date, "hh:mm a")}`
    : format(date, "MMM dd, hh:mm a");
};


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const API = "https://chitchat-j7mk.onrender.com";
