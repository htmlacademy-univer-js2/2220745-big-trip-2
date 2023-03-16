import { createElement } from '../render';

const createOffersTemplate = (offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`;

export default class OffersView {
  constructor(offer) {
    this.offer = offer;
    this.element = null;
  }

  getTemplate() {
    return createOffersTemplate(this.offer);
  }

  getElement() {
    this.element = this.element || createElement(this.getTemplate());
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
