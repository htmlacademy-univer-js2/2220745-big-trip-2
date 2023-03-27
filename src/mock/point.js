import { randomInteger } from '../utils';
import dayjs from 'dayjs';

const dayjsTypes = ['d', 'h'];
let currentDate = dayjs().add(randomInteger(-7, 7), dayjsTypes[randomInteger(0, 1)]);

const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const createPoint = (id) => {
  const dateFrom = currentDate;
  const dateTo = currentDate.add(randomInteger(2, 7), dayjsTypes[randomInteger(0, 1)]);
  currentDate = dateTo;
  return {
    basePrice: randomInteger(500, 3000),
    dateFrom: dateFrom,
    dateTo: dateTo,
    destination: randomInteger(0, 9),
    id: id,
    isFavorite: Boolean(randomInteger(0, 1)),
    offers: Array.from({ length: randomInteger(1, 3) }, () => randomInteger(0, 4)),
    type: types[randomInteger(0, types.length - 1)],
  };
};
