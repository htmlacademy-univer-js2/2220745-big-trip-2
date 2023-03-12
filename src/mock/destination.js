import { randomInteger } from '../utils';

const descriptions = ['Просто бомба', 'Smth idk', 'OK'];
const names = ['LA', 'Moscow', 'Berlin', 'London', 'Paris', 'Rome', 'Madrid'];

export const createDestination = (id) => ({
  id: id,
  description: descriptions[randomInteger(0, descriptions.length - 1)],
  name: names[randomInteger(0, names.length - 1)],
  pictures: [
    {
      src: `http://picsum.photos/248/152?r=${randomInteger(0, 100)}`,
      description: descriptions[randomInteger(0, descriptions.length - 1)],
    },
  ],
});
