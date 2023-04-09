import { UpdateType, UserAction } from '../const';
import { RenderPosition, remove, render } from '../framework/render';
import EditPointView from '../view/edit-point-view';
export default class NewPointPresenter {
  #destinations = null;
  #offers = null;

  #newPointComponent = null;
  #pointsListContainer = null;

  #handleDestroy = null;
  #handleChangeData = null;

  constructor({ newPointContainer, pointsModel, handleChangeData, handleDestroy }) {
    this.#pointsListContainer = newPointContainer;
    this.#destinations = pointsModel.destinations;
    this.#offers = pointsModel.offers;
    this.#handleChangeData = handleChangeData;
    this.#handleDestroy = handleDestroy;
  }

  init() {
    if (this.#newPointComponent !== null) {
      return;
    }
    this.#newPointComponent = new EditPointView({
      destinations: this.#destinations,
      offersByType: this.#offers,
      saveClick: this.#handleSaveClick,
      deleteClick: this.#handleCloseClick,
      closeClick: this.#handleCloseClick,
    });

    render(this.#newPointComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFromState = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#newPointComponent.shake(resetFromState);
  };

  destroy() {
    if (this.#newPointComponent === null) {
      return;
    }

    this.#handleDestroy();
    remove(this.#newPointComponent);
    this.#newPointComponent = null;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleSaveClick = (point) => {
    this.#handleChangeData(UserAction.ADD_POINT, UpdateType.MAJOR, point);
  };

  #handleCloseClick = () => {
    this.destroy();
  };
}
