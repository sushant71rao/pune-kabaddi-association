import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { differenceInYears } from "date-fns";


export const calculateAge = (selectedDate: Date | Date[] | undefined) => {
  if (selectedDate) {
    const currentDate = new Date();
    const userSelectedDate = Array.isArray(selectedDate)
      ? selectedDate[0]
      : selectedDate;

    return differenceInYears(currentDate, userSelectedDate)

  }
  else {
    return 0
  }
}