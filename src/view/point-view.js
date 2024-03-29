import dayjs from 'dayjs';
import { humanizeDateTime, upperCaseFirst } from '../utils';
import AbstractView from '../framework/view/abstract-view';

const createOffersTemplate = (offers, type, activeOffersIds) => {
  const offersByType = offers.find((offer) => offer.type === type).offers;
  return offersByType.map((offer) =>
    activeOffersIds.includes(offer.id)? `
      <li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>
    `.trim() : '').join('\n');
};

const createPointTemplate = (point, destinations, offersByType) => {
  let { dateFrom, dateTo } = point;
  const { basePrice, destination, isFavorite, offers, type } = point;

  dateFrom = dayjs(dateFrom);
  dateTo = dayjs(dateTo);
  const datetimeBetween = humanizeDateTime(dateFrom, dateTo);
  const destinationName = destinations.find((dest) => dest.id === destination).name;

  const activeOffersTemplate = createOffersTemplate(offersByType, type, offers);

  return `
  <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dateFrom.format('MMM D')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${upperCaseFirst(type)} ${destinationName}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${dateFrom.format('HH:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${dateTo.format('HH:mm')}</time>
        </p>
        <p class="event__duration">${datetimeBetween}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${activeOffersTemplate}
      </ul>
      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class PointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offersByType = null;

  #editClick = null;
  #favoriteClick = null;

  constructor({ point, destinations, offersByType, editClick, favoriteClick }) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;

    this.#editClick = editClick;
    this.#favoriteClick = favoriteClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destinations, this.#offersByType);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#editClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#favoriteClick();
  };
}
