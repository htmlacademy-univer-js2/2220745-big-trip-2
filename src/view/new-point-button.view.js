import AbstractView from '../framework/view/abstract-view';

const createNewPointButtonTemplate = () =>
  '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>;';

export default class NewPointButtonView extends AbstractView {
  #buttonClick = null;

  constructor({ buttonClick }) {
    super();
    this.#buttonClick = buttonClick;

    this.element.addEventListener('click', this.#buttonClickHandler);
  }

  get template() {
    return createNewPointButtonTemplate();
  }

  #buttonClickHandler = (evt) => {
    evt.preventDefault();
    this.#buttonClick();
  };
}
