import AbstractView from '../framework/view/abstract-view';

const createPointsListTemplate = () => '<ul class="trip-events__list">';

export default class PointsListView extends AbstractView {
  get template() {
    return createPointsListTemplate();
  }
}
