import AbsractView from '../framework/view/abstract-view';

const createEmptyPointsListTemplate = () => '<p class="trip-events__msg">Click New Event to create your first point</p>';

export default class EmptyPointsListView extends AbsractView {
  get template() {
    return createEmptyPointsListTemplate();
  }
}
