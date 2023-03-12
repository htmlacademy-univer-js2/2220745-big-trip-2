import { createDestination } from '../mock/destination';
import { createOfferByType } from '../mock/offers-by-type';
import { createPoint } from '../mock/point';

export default class PointModel {
  constructor() {
    this.destinations = [];
    this.offersByType = [];
    this.points = [];

    for (let i = 0; i < 10; i++) {
      this.destinations.push(createDestination(i));
    }
    for (let i = 0; i < 9; i++) {
      this.offersByType.push(createOfferByType(i));
    }

    for (let i = 0; i < 4; i++) {
      this.points.push(createPoint(i));
    }
  }

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType() {
    return this.offersByType;
  }
}
