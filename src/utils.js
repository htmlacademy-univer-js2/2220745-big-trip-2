const randomInteger = (min, max) => {
  const random = min + Math.random() * (max + 1 - min);
  return Math.floor(random);
};

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
    return `${parseInt(datetimeBetween / oneDayInMilliseconds, 10)}D ${parseInt((datetimeBetween % oneDayInMilliseconds) / oneHourInMilliseconds, 10)}H ${
      parseInt(datetimeBetween % oneHourInMilliseconds, 10) / oneMinuteInMilliseconds
    }M`;
  } else if (datetimeBetween > oneHourInMilliseconds) {
    return `${parseInt((datetimeBetween % oneDayInMilliseconds) / oneHourInMilliseconds, 10)}H ${parseInt(datetimeBetween % oneHourInMilliseconds, 10) / oneMinuteInMilliseconds}M`;
  } else {
    return `${parseInt(datetimeBetween % oneHourInMilliseconds, 10) / oneMinuteInMilliseconds}M`;
  }
};

const isDateBefore = (dateFrom, dateTo) => {
  return dateTo.diff(dateFrom) > 0;
};

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [...items.slice(0, index), update, ...items.slice(index + 1)];
};

const SortFuntions = {
  DAY: (firstPoint, secondPoint) => firstPoint.dateFrom.diff(secondPoint.dateFrom),
  TIME: (firstPoint, secondPoint) => secondPoint.dateFrom.diff(secondPoint.dateTo) - firstPoint.dateFrom.diff(firstPoint.dateTo),
  PRICE: (firstPoint, secondPoint) => firstPoint.basePrice - secondPoint.basePrice,
};

export { randomInteger, humanizeDateTime, upperCaseFirst, isDateBefore, updateItem, SortFuntions };
