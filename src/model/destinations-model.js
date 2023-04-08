import { createDestination } from '../mock/destination';
import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinations = null;

  constructor() {
    super();
    this.#destinations = [];

    for (let i = 0; i < 10; i++) {
      this.#destinations.push(createDestination(i));
    }
  }

  get destinations() {
    return this.#destinations;
  }
}
