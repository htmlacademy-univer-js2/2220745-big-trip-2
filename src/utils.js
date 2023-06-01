import { FilterType, SortType } from './const';
import dayjs from 'dayjs';

function upperCaseFirst(str) {
  if (!str) {
    return str;
  }

  return str[0].toUpperCase() + str.slice(1);
}

const humanizeDateTime = (dateFrom, dateTo) => {
  const oneMinuteInMilliseconds = 60 * 1000;
  const oneHourInMilliseconds = 60 * oneMinuteInMilliseconds;
  const oneDayInMilliseconds = 24 * oneHourInMilliseconds;

  const datetimeBetween = dateTo.diff(dateFrom);

  if (datetimeBetween > oneDayInMilliseconds) {
    return `${parseInt(datetimeBetween / oneDayInMilliseconds, 10)}D ${parseInt(
      (datetimeBetween % oneDayInMilliseconds) / oneHourInMilliseconds,
      10
    )}H ${parseInt((datetimeBetween % oneHourInMilliseconds) / oneMinuteInMilliseconds, 10)}M`;
  } else if (datetimeBetween > oneHourInMilliseconds) {
    return `${parseInt((datetimeBetween % oneDayInMilliseconds) / oneHourInMilliseconds, 10)}H ${parseInt(
      (datetimeBetween % oneHourInMilliseconds) / oneMinuteInMilliseconds,
      10
    )}M`;
  }
  return `${parseInt((datetimeBetween % oneHourInMilliseconds) / oneMinuteInMilliseconds, 10)}M`;
};

const isFirstDateBeforeSecond = (dateFrom, dateTo) => dayjs(dateTo).diff(dayjs(dateFrom)) > 0;

const SortFunctions = {
  [SortType.DAY]: (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom).diff(dayjs(secondPoint.dateFrom)),
  [SortType.TIME]: (firstPoint, secondPoint) =>
    dayjs(secondPoint.dateFrom).diff(dayjs(secondPoint.dateTo)) -
    dayjs(firstPoint.dateFrom).diff(dayjs(firstPoint.dateTo)),
  [SortType.PRICE]: (firstPoint, secondPoint) => firstPoint.basePrice - secondPoint.basePrice,
};

const FilterFunctions = {
  [FilterType.EVERYTHING]: () => true,
  [FilterType.FUTURE]: (point) => {
    const today = dayjs();
    return !isFirstDateBeforeSecond(point.dateFrom, today);
  },
  [FilterType.PAST]: (point) => {
    const today = dayjs();
    return isFirstDateBeforeSecond(point.dateTo, today);
  },
};

export { humanizeDateTime, upperCaseFirst, isFirstDateBeforeSecond, SortFunctions, FilterFunctions };
