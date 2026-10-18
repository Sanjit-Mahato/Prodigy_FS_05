import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNowStrict, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(dateInput: string | Date | number): string {
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return '';
    const distance = formatDistanceToNowStrict(date, { addSuffix: false });

    // Shorten format: "5 minutes" -> "5m", "2 hours" -> "2h", "3 days" -> "3d"
    return distance
      .replace(' seconds', 's')
      .replace(' second', 's')
      .replace(' minutes', 'm')
      .replace(' minute', 'm')
      .replace(' hours', 'h')
      .replace(' hour', 'h')
      .replace(' days', 'd')
      .replace(' day', 'd')
      .replace(' months', 'mo')
      .replace(' month', 'mo')
      .replace(' years', 'y')
      .replace(' year', 'y');
  } catch {
    return '';
  }
}

export function formatFullDate(dateInput: string | Date): string {
  try {
    const date = new Date(dateInput);
    return format(date, 'MMMM yyyy');
  } catch {
    return '';
  }
}

export function formatCount(count: number): string {
  if (count >= 1_000_000) {
    return (count / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (count >= 1_000) {
    return (count / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return count.toString();
}
