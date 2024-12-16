import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatBigNumber = (num: number) => {
  if (!num) return 'Unavailable';
  if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
  return num.toFixed(2)
}

export const formatStockPrice = (num: number) => {
  if (!num) return 'Unavailable';
  return num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const formatNumberToCurrency = (num: number, currency: string) => {
  if (!num) return 'Unavailable';
  return `${formatStockPrice(num)}${currency}`; 
  
}

export const formatBigNumberToCurrency = (num: number, currency: string) => {
  if (!num) return 'Unavailable';
  return `${formatBigNumber(num)}${currency}`;
}
