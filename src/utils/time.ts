import { GAME_SETTINGS } from "@/app/play/constants";
import {
  add,
  closestTo,
  Duration,
  intervalToDuration,
  isFriday,
  isTuesday,
  nextFriday,
  nextTuesday,
  previousFriday,
  previousTuesday,
  subDays,
  parse,
  differenceInDays,
  endOfMonth,
  format,
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const PH_TIMEZONE = "Asia/Manila";
export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const DATE_FORMAT = "yyyy-MM-dd";

export const getDateInPh = (date = new Date()) => {
  return toZonedTime(date, PH_TIMEZONE);
};

export const isInFuture = (date = new Date()) => {
  return date > getDateInPh();
};

export const isFormattedDateInFuture = (formattedDate: string) => {
  const date = new Date(`${formattedDate} 00:00:00 GMT+0800`);
  return isInFuture(date);
};

/** DAILY GAME UTILS */
export const getFormattedDateInPh = (date = new Date()) => {
  return formatInTimeZone(date, PH_TIMEZONE, DATE_FORMAT);
};

export const getNextFormattedDateInPh = (date = new Date()) => {
  const nextDate = add(date, { days: 1 });
  return formatInTimeZone(nextDate, PH_TIMEZONE, DATE_FORMAT);
};

export const getPrevFormattedDateInPh = (date = new Date()) => {
  const prevDate = add(date, { days: -1 });
  return formatInTimeZone(prevDate, PH_TIMEZONE, DATE_FORMAT);
};

export const getDailyGameCountdown = (date = new Date()) => {
  const midnightInPh = new Date(
    `${getNextFormattedDateInPh()} 00:00:00 GMT+0800`
  );
  const currDateInPh = getDateInPh(date);

  return intervalToDuration({
    start: currDateInPh,
    end: midnightInPh,
  });
};

/** SALTONG HEX UTILS */

export const getHexDateInPh = (date = new Date()) => {
  const dateInPh = getDateInPh(date);

  if (isTuesday(dateInPh) || isFriday(dateInPh)) {
    return dateInPh;
  }

  return closestTo(dateInPh, [
    previousTuesday(dateInPh),
    previousFriday(dateInPh),
  ])!;
};

export const getFormattedHexDateInPh = (date = new Date()) => {
  return format(getHexDateInPh(date), DATE_FORMAT);
};

export const getPrevFormattedHexDateInPh = (date = new Date()) => {
  const currHexDate = getHexDateInPh(date);

  if (isTuesday(currHexDate)) {
    return format(previousFriday(date), DATE_FORMAT);
  }

  return format(previousTuesday(date), DATE_FORMAT);
};

export const getNextFormattedHexDateInPh = (date = new Date()) => {
  const currDateInPh = getDateInPh();

  if (isTuesday(currDateInPh)) {
    return formatInTimeZone(nextFriday(date), PH_TIMEZONE, DATE_FORMAT);
  }

  if (isFriday(currDateInPh)) {
    return formatInTimeZone(nextTuesday(date), PH_TIMEZONE, DATE_FORMAT);
  }

  return formatInTimeZone(
    closestTo(currDateInPh, [nextTuesday(date), nextFriday(date)])!,
    PH_TIMEZONE,
    DATE_FORMAT
  );
};

export const getHexGameCountdown = (date = new Date()) => {
  const nextHexDate = new Date(
    `${getNextFormattedHexDateInPh()} 00:00:00 GMT+0800`
  );
  const currDateInPh = toZonedTime(date, PH_TIMEZONE);

  return intervalToDuration({
    start: currDateInPh,
    end: nextHexDate,
  });
};

/**
 * Gets the nth occurrence of Tuesdays and Fridays from a given start date.
 * @param startDate - The reference start date (must be a Tuesday or Friday).
 * @param givenDate - The date to find the nth occurrence for.
 * @returns The nth occurrence of Tuesday or Friday relative to the start date.
 */
export function getNthTuesdayFriday(
  startDate: string,
  givenDate: string
): number | null {
  const start = parse(startDate, "yyyy-MM-dd", new Date());
  let given = parse(givenDate, "yyyy-MM-dd", new Date());

  if (!isTuesday(given) && !isFriday(given)) {
    given = closestTo(given, [previousTuesday(given), previousFriday(given)])!;
  }

  if (!isTuesday(start) && !isFriday(start)) {
    throw new Error("Start date must be a Tuesday or Friday");
  }

  if (given < start) return null; // Given date must be after or equal to start date

  // Compute total days between startDate and givenDate
  const daysDiff = differenceInDays(given, start);

  // Tuesdays and Fridays alternate every 3 and 4 days
  // Cycle length is 7 days (Tue -> Fri -> Tue -> Fri...)
  const nthOccurrence =
    Math.floor(daysDiff / 7) * 2 + (daysDiff % 7 >= 3 ? 2 : 1);

  return nthOccurrence;
}

const START_DATE = GAME_SETTINGS.hex.config.startDate;

export const getHexDatesWithPagination = (year: number, month: number) => {
  let hexDates = [];
  const start = new Date(START_DATE);
  const startDate = new Date(year, month, 1);
  const endDate = endOfMonth(startDate);
  const today = getDateInPh(new Date());
  let currentDate = getDateInPh(endDate);

  // Calculate the initial iteration based on the start date and current date
  let currentIteration = getNthTuesdayFriday(
    START_DATE,
    formatInTimeZone(currentDate, PH_TIMEZONE, DATE_FORMAT)
  );

  while (currentDate >= start && currentDate >= startDate) {
    if (isTuesday(currentDate) || isFriday(currentDate)) {
      hexDates.push({
        date: formatInTimeZone(currentDate, PH_TIMEZONE, DATE_FORMAT),
        iteration: currentIteration,
      });
      if (currentIteration !== null) {
        currentIteration--;
      }
    }
    currentDate = subDays(currentDate, 1);
  }

  hexDates = hexDates.filter((hexDate) => {
    const hexDateObj = new Date(hexDate.date);
    return hexDateObj <= today;
  });

  return hexDates;
};

const zeroPad = (num: number) => String(num).padStart(2, "0");
export const formatShortDuration = (duration: Duration) => {
  const { days, hours, minutes, seconds } = duration;

  let formattedDuration = "";

  if (days) {
    formattedDuration += `${days}d `;
  }

  formattedDuration += `${days ? zeroPad(hours ?? 0) : (hours ?? 0)}h ${zeroPad(minutes ?? 0)}m ${zeroPad(seconds ?? 0)}s`;

  return formattedDuration;
};

export const getDurationString = (time: number) => {
  const interval = { start: 0, end: time };
  const baseDuration = intervalToDuration(interval);
  const diffInDays = differenceInDays(interval.end, interval.start);
  const duration = {
    d: diffInDays,
    h: baseDuration.hours,
    m: baseDuration.minutes,
    s: baseDuration.seconds,
  };

  const timeStr = Object.entries(duration)
    .filter(([, value]) => value && value > 0)
    .map(([key, value]) => `${value}${key}`)
    .join(" ");

  return timeStr;
};
