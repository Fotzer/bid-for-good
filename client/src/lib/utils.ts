import { PeriodSelectorValue } from "@/components/common/period-selector/types";
import { type ClassValue, clsx } from "clsx";
import { parseISO, differenceInDays, formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isWithinPeriod = (
  value: string,
  period: PeriodSelectorValue | null
): boolean => {
  if (!period) return true;

  const currentDate = new Date();
  const selectedDate = parseISO(value);

  let daysDifference = 0;

  switch (period) {
    case "7d":
      daysDifference = differenceInDays(currentDate, selectedDate);
      return daysDifference <= 7;
    case "14d":
      daysDifference = differenceInDays(currentDate, selectedDate);
      return daysDifference <= 14;
    case "30d":
      daysDifference = differenceInDays(currentDate, selectedDate);
      return daysDifference <= 30;
    default:
      return true;
  }
};

export const formatRelativeTime = (isoDateString: string): string => {
  const date = parseISO(isoDateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
