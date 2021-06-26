import { times } from "lodash";

import {
  differenceInCalendarWeeks,
  addWeeks,
  parseISO,
  format,
} from "date-fns";

const interpolateData = (
  data: { id: string, dateTime: string, monthlyListeners: number }[]
): { dateTime: string, monthlyListeners: number }[] | null => {
  if (!data.length) return null;

  const addWeeksToDateString = (string, weeks) => {
    return format(addWeeks(parseISO(string), weeks), "yyyy-MM-dd");
  };
  const formatYYYMMDD = (string) => format(parseISO(string), "yyyy-MM-dd");
  const oldestDate = data[0].dateTime;
  const newestDate = data[data.length - 1].dateTime;
  const nWeeks = Math.abs(
    differenceInCalendarWeeks(parseISO(oldestDate), parseISO(newestDate))
  );
  const intervalled = times(nWeeks + 1).map((week) => {
    const startOfWeek = addWeeksToDateString(oldestDate, week);
    return {
      dateTime: startOfWeek,
      monthlyListeners: data.find(
        ({ dateTime }) => formatYYYMMDD(dateTime) === startOfWeek
      )?.monthlyListeners,
    };
  });

  let first = undefined;
  let chunked = [];
  let interpolated = [];

  intervalled.map((interval) => {
    if (Number.isInteger(interval.monthlyListeners) && !first) {
      first = interval;
      interpolated.push(interval);
    } else if (!Number.isInteger(interval.monthlyListeners)) {
      chunked.push(interval);
    } else if (Number.isInteger(interval.monthlyListeners) && first) {
      const last = interval;
      const firstLastDifference =
        last.monthlyListeners - first.monthlyListeners;
      chunked = chunked.map((interval2, indeX) => ({
        ...interval2,
        monthlyListeners: Number(
          (firstLastDifference > 0
            ? first.monthlyListeners +
              ((indeX + 1) / chunked.length) * firstLastDifference
            : first.monthlyListeners
          ).toFixed(0)
        ),
      }));
      interpolated = [...interpolated, ...chunked, last];
      first = interval;
      chunked = [];
    }
  });
  const selectedInterval = Math.ceil(intervalled.length / 10);
  const interPolatedSelected = interpolated
    .reverse()
    .filter((_, index) => index % selectedInterval === 0)
    .reverse();
  return interPolatedSelected.length >= 2 ? interPolatedSelected : null;
};

export default interpolateData;
