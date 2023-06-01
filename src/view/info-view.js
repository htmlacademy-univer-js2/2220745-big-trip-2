import AbsractView from '../framework/view/abstract-view';
import dayjs from 'dayjs';
import { SortFunctions } from '../utils';
import { SortType } from '../const';

const createTripTitleInfo = (points, destinations) => {
  const destinationsOrder = [];
  for (const point of points) {
    const destinationName = destinations.find((destination) => destination.id === point.destination).name;
    if (destinationsOrder.length === 0 || destinationName !== destinationsOrder[destinationsOrder.length - 1]) {
      destinationsOrder.push(destinationName);
    }
  }

  if (destinationsOrder.length === 1) {
    return destinationsOrder[0];
  } else if (destinationsOrder.length > 3) {
    return `${destinationsOrder[0]} &mdash;...&mdash; ${destinationsOrder[destinationsOrder.length - 1]}`;
  }
  return destinationsOrder.join(' &mdash; ');
};

const createDatesInfo = (points) =>
  `${dayjs(points[0].dateFrom).format('MMM D')}&nbsp;&mdash;&nbsp;${dayjs(points[points.length - 1].dateTo).format('MMM D')}`;

const getFullPointPrice = (point, offersByType) => {
  const offers = offersByType.find((offerByType) => offerByType.type === point.type).offers;
  const offersPrice = point.offers.reduce((currentValue, offer) => offers.find((off) => off.id === offer).price + currentValue, 0);
  return offersPrice + point.basePrice;
};

const createInfoTemplate = (points, destinations, offersByType) => {
  const summaryPrice = points.reduce((currentValue, point) => getFullPointPrice(point, offersByType) + currentValue, 0);
  const tripInfoTitle = createTripTitleInfo(points, destinations);
  const datesInfo = createDatesInfo(points);
  return `
  <section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${tripInfoTitle}</h1>

      <p class="trip-info__dates">${datesInfo}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${summaryPrice}</span>
    </p>
  </section>`;
};

export default class InfoView extends AbsractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor(points, destinations, offers) {
    super();
    this.#points = points.sort(SortFunctions[SortType.DAY]);
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
