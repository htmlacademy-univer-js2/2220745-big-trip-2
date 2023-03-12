import { randomInteger } from '../utils';

const titles = ['First', 'Business', 'SAMOLET'];

export const createOffer = (id) => ({
  id: id,
  title: titles[randomInteger(0, titles.length - 1)],
  price: randomInteger(10, 500),
});
