import { render } from '../render';
import EditPointView from '../view/edit-point-view';
import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import OffersView from '../view/offer-view';
import EditPointOfferView from '../view/edit-point-offer-view';

export default class Trip {
  constructor({ container }) {
    this.component = new PointsListView();
    this.container = container;
  }

  init(pointsModel) {
    [this.editPoint, ...this.points] = [...pointsModel.getPoints()];
    this.destinations = [...pointsModel.getDestinations()];
    this.offersByType = [...pointsModel.getOffersByType()];

    render(new SortView(), this.container);
    render(this.component, this.container);

    let offerType = this.editPoint.type;
    let offerIds = this.editPoint.offers;
    let offers = this.offersByType.filter((offer) => offer.type === offerType)[0].offers;
    this.editPoint = new EditPointView(this.editPoint, this.destinations);
    render(this.editPoint, this.component.getElement());
    for (const offer of offers) {
      render(new EditPointOfferView(offer, offerIds.includes(offer.id)), this.editPoint.getElement().querySelector('.event__available-offers'));
    }

    for (let i = 0; i < this.points.length; i++) {
      const newPoint = new PointView(this.points[i], this.destinations, this.offers, this.offersByType);
      render(newPoint, this.component.getElement());

      offerType = this.points[i].type;
      offerIds = this.points[i].offers;
      offers = this.offersByType.filter((offer) => offer.type === offerType)[0].offers;
      for (const id of offerIds) {
        const offer = offers.filter((off) => off.id === id)[0] || '';
        if (offer !== '') {
          render(new OffersView(offer), newPoint.getElement().querySelector('.event__selected-offers'));
        }
      }
    }
  }
}
