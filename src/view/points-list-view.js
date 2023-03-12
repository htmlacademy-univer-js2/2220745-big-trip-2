import { createElement } from '../render';

const createPointsListTemplate = () => '<ul class="trip-events__list">';

export default class PointsListView {
  constructor() {
    this.element = null;
  }

  getTemplate() {
    return createPointsListTemplate();
  }

  getElement() {
    this.element = this.element || createElement(this.getTemplate());
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
