import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  format,
  differenceInHours,
  differenceInDays,
  differenceInWeeks,
} from 'date-fns';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isActivePath(currentpath: string, targetPath: string) {
  if (targetPath === "/") {
    return currentpath === "/" || currentpath.includes('chats');
  }

  return currentpath.includes(targetPath) || currentpath === targetPath;

}

export const getFormattedTimestamp = (timestamp: number) => {
  const now = new Date();
  const date = new Date(timestamp);

  if (differenceInHours(now, date) < 24) {
    return format(date, 'HH:mm');
  } else if (differenceInDays(now, date) < 7) {
    return format(date, 'EEE');
  } else if (differenceInWeeks(now, date) < 4) {
    return format(date, "'Week' w");
  } else {
    return format(date, 'MMM');
  }
};

export const pluralize = (word: string, length: number) =>
  length <= 1 ? word : `${word}s`;