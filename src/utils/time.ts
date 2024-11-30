import {
  add,
  closestTo,
  isFriday,
  isTuesday,
  previousFriday,
  previousTuesday,
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const PH_TIMEZONE = "Asia/Manila";
export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const DATE_FORMAT = "yyyy-MM-dd";

export const isValidDate = (_date: string) => {
  // TODO: check if date matches the DATE_FORMAT
};

// use date-fns and/or date-fns-tz
export const getDateInPh = (date = new Date()) => {
  return formatInTimeZone(date, PH_TIMEZONE, DATE_FORMAT);
};

export const getPrevDateInPh = (date = new Date()) => {
  const prevDate = add(date, { days: -1 });
  return formatInTimeZone(prevDate, PH_TIMEZONE, DATE_FORMAT);
};

export const getHexDateInPh = (date = new Date()) => {
  const dateInPh = toZonedTime(date, PH_TIMEZONE);

  // get the closest occured Tuesday or Friday in the PH timezone

  // if the date is Tuesday or Friday, return the date
  if (isTuesday(dateInPh) || isFriday(dateInPh)) {
    return formatInTimeZone(dateInPh, PH_TIMEZONE, DATE_FORMAT);
  }

  return formatInTimeZone(
    closestTo(dateInPh, [previousTuesday(dateInPh), previousFriday(dateInPh)])!,
    PH_TIMEZONE,
    DATE_FORMAT
  );
};
