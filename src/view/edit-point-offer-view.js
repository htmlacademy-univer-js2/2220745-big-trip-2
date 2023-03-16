import { createElement } from '../render';

const createOffersTemplate = (offer, checked) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}"
       ${checked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-comfort-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`;

export default class EditPointOfferView {
  constructor(offer, checked) {
    this.offer = offer;
    this.checked = checked;
    this.element = null;
  }

  getTemplate() {
    return createOffersTemplate(this.offer, this.checked);
  }

  getElement() {
    this.element = this.element || createElement(this.getTemplate());
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
