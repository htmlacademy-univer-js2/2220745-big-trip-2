import { randomInteger } from '../utils';

const dates = [
  '2019-07-10T21:53:56.845Z',
  '2019-07-11T11:45:56.845Z',
  '2019-07-15T12:35:56.845Z',
  '2019-07-26T13:22:56.845Z',
  '2019-08-01T16:41:56.845Z',
  '2019-08-12T11:12:56.845Z',
  '2019-08-14T09:22:56.845Z',
];

const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const createPoint = (id) => {
  const dateFrom = dates[id];
  const dateTo = dates[id + 1];
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
