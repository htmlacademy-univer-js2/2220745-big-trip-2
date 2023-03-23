import { createElement } from '../render';

const createEmptyPointsListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyPointsListView {
  #element = null;

  constructor() {
    this.#element = null;
  }

  get template() {
    return createEmptyPointsListTemplate();
  }

  get element() {
    this.#element = this.#element || createElement(this.template);
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
