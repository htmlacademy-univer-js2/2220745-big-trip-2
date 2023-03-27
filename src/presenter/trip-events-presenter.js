import { render, RenderPosition, replace } from '../framework/render';
import EditPointView from '../view/edit-point-view';
import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import PointView from '../view/point-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';

export default class Trip {
  #pointsListComponent = new PointsListView();
  #container = null;

  #pointsModel = null;
  #points = [];
  #destinations = [];
  #offersByType = [];

  constructor(container, pointsModel) {
    this.#container = container;
    this.#pointsModel = pointsModel;
  }

  #renderPoint(point) {
    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key == 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    const pointElement = new PointView({
      point: point,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      editClick: () => {
        replacePointToForm.call();
        document.addEventListener('keydown', onEscKeyDown);
      },
    });

    const editFormElement = new EditPointView({
      point: point,
      destinations: this.#destinations,
      offersByType: this.#offersByType,
      saveClick: () => {
        replaceFormToPoint.call();
        document.removeEventListener('keydown', onEscKeyDown);
      },
    });

    function replacePointToForm() {
      replace(editFormElement, pointElement);
    }

    function replaceFormToPoint() {
      replace(pointElement, editFormElement);
    }

    render(pointElement, this.#pointsListComponent.element);
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offersByType = [...this.#pointsModel.offersByType];

    if (this.#points.length === 0) {
      render(new EmptyPointsListView(), this.#container);
    } else {
      render(new InfoView(this.#points, this.#destinations), document.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);
      render(new FiltersView(this.#points), document.querySelector('.trip-controls__filters'));
      render(new SortView(), this.#container);
      render(this.#pointsListComponent, this.#container);

      for (let i = 0; i < this.#points.length; i++) {
        this.#renderPoint(this.#points[i]);
      }
    }
  }
}
