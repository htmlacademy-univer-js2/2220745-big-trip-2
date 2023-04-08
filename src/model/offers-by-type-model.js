import { createOffersByType } from '../mock/offers-by-type';
import Observable from '../framework/observable';

export default class OffersByTypeModel extends Observable {
  #offersByType = null;

  constructor() {
    super();
    this.#offersByType = [];

    for (let i = 0; i < 9; i++) {
      this.#offersByType.push(createOffersByType(i));
    }
  }

  get offersByType() {
    return this.#offersByType;
  }
}
