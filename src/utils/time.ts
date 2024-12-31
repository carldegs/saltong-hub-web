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
} from "date-fns";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const PH_TIMEZONE = "Asia/Manila";
export const DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:ss";
export const DATE_FORMAT = "yyyy-MM-dd";

export const getDateInPh = (date = new Date()) => {
  return toZonedTime(date, PH_TIMEZONE);
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

export const getFormattedHexDateInPh = (date = new Date()) => {
  const dateInPh = getDateInPh(date);

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
