import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { upperCaseFirst } from '../utils';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 0,
  id: 0,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const createOffersTemplate = (offers) =>
  offers
    .map(
      (offer) => `
        <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" 
        id="event-offer-${offer.title}-1" type="checkbox" 
        name="event-offer-${offer.title}" ${offer.isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${offer.title}" data-name="${offer.id}">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    )
    .join('\n');

const createTypesTemplate = (offersByType) => {
  const types = offersByType.map((type) => type.type);
  return types
    .map(
      (type) => `
    <div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}">
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
      ${upperCaseFirst(type)}</label>
    </div>`
    )
    .join('\n');
};

const createDestinationsOptionsTemplate = (destinations) =>
  destinations.map((destination) => `<option value="${destination.name}">${destination.name}</option>`).join('\n');

const createEditPointTemplate = (point, destinations, offersByType) => {
  let { dateFrom, dateTo } = point;
  const { basePrice, destination, type, offers } = point;

  dateFrom = dayjs(dateFrom);
  dateTo = dayjs(dateTo);

  const offersTemplate = createOffersTemplate(offers);
  const typesTemplate = createTypesTemplate(offersByType);
  const destinationsTemplate = createDestinationsOptionsTemplate(destinations);

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesTemplate}
            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${upperCaseFirst(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination"
            value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsTemplate}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time"
            value="${dateFrom.format('DD/MM/YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time"
            value="${dateTo.format('DD/MM/YY HH:mm')}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersTemplate}
          </div>
        </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">
            ${destination.description}
          </p>
        </section>
      </section>
    </form>
  </li>`;
};

export default class EditPointView extends AbstractStatefulView {
  #destinations = null;
  #offersByType = null;

  #saveClick = null;
  #closeClick = null;
  #deleteClick = null;

  #dateFromPicker = null;
  #dateToPicker = null;

  constructor({ point = BLANK_POINT, destinations, offersByType, saveClick, closeClick, deleteClick }) {
    super();
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this._state = EditPointView.parsePointToState(point, offersByType, destinations);

    this.#saveClick = saveClick;
    this.#closeClick = closeClick;
    this.#deleteClick = deleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#offersByType);
  }

  removeElement() {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }
    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  }

  reset(point) {
    this.updateElement(EditPointView.parsePointToState(point, this.#offersByType, this.#destinations));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeClickHandler);
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#saveClickHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('click', this.#offersCheckHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#setDateFromPicker();
    this.#setDateToPicker();
  }

  #setDateFromPicker() {
    this.#dateFromPicker = flatpickr(this.element.querySelector('#event-start-time-1'), {
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateFrom,
      onClose: this.#dateFromChangeHandler,
      enableTime: true,
    });
  }

  #setDateToPicker() {
    this.#dateToPicker = flatpickr(this.element.querySelector('#event-end-time-1'), {
      dateFormat: 'd/m/y H:i',
      defaultDate: this._state.dateTo,
      onClose: this.#dateToChangeHandler,
      enableTime: true,
    });
  }

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    if (this._state.isDesinationCorrect) {
      this.#saveClick(EditPointView.parseStateToPoint(this._state));
    }
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#deleteClick(EditPointView.parseStateToPoint(this._state));
  };

  #closeClickHandler = (evt) => {
    evt.preventDefault();
    this.#closeClick();
  };

  #priceInputHandler = (evt) => {
    this._setState({
      basePrice: parseInt(evt.target.value, 10),
    });
  };

  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    this.updateElement({
      type: type,
      offersObjects: this.#offersByType
        .find((offer) => offer.type === type)
        .offers.map((offer) => ({ ...offer, isChecked: false })),
    });
  };

  #offersCheckHandler = (evt) => {
    let offerId = evt.target.dataset.name;
    if (!offerId) {
      offerId = evt.target.parentNode.dataset.name;
    }
    offerId = parseInt(offerId, 10);
    const checkedOffer = this._state.offers.find((offer) => offer.id === offerId);
    checkedOffer.isChecked = !checkedOffer.isChecked;

    this.updateElement({
      offers: [...this._state.offers],
    });
  };

  #destinationChangeHandler = (evt) => {
    const chosenDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (chosenDestination) {
      this.updateElement({
        destination: chosenDestination,
        isDesinationCorrect: true,
      });
    } else {
      this.updateElement({
        isDesinationCorrect: false,
      });
    }
  };

  static parsePointToState = (point, offersByType, destinations) => ({
    ...point,
    offers: offersByType
      .find((offer) => offer.type === point.type)
      .offers.map((offer) => ({
        ...offer,
        isChecked: point.offers.includes(offer.id),
      })),
    destination: destinations.find((destination) => destination.id === point.destination),
    isDesinationCorrect: true,
  });

  static parseStateToPoint = (state) => {
    const point = {
      ...state,
      destination: state.destination.id,
      offers: state.offers.filter((offer) => offer.isChecked).map((offer) => offer.id),
    };

    delete point.isDesinationCorrect;

    return point;
  };
}
