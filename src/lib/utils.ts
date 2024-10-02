import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isActivePath(currentpath: string, targetPath: string) {
  if (targetPath === "/") {
    return currentpath === "/" || currentpath.includes('chats');
  }
  
  return currentpath.includes(targetPath) || currentpath === targetPath;
  
}