import AbsractView from '../framework/view/abstract-view';

const createLoadingTemplate = () => '<p class="trip-events__msg">Loading...</p>';

export default class LoadingView extends AbsractView {
  get template() {
    return createLoadingTemplate();
  }
}
