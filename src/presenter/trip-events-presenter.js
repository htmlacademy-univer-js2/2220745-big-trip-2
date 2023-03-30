import { render, RenderPosition, replace } from '../framework/render';
import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import InfoView from '../view/info-view';
import FiltersView from '../view/filters-view';
import PointPresenter from './point-presenter';
import { updateItem } from '../utils';

export default class Trip {
  #pointsListComponent = new PointsListView();
  #container = null;

  #sortComponent = null;
  #emptyPointsListComponent = null;

  #points = null;
  #destinations = null;
  #offersByType = null;

  #pointPresenter = new Map();

  constructor(container, pointsModel) {
    this.#container = container;
    this.#points = pointsModel.points;
    this.#destinations = pointsModel.destinations;
    this.#offersByType = pointsModel.offersByType;
  }

  init() {
    if (this.#points.length === 0) {
      this.#renderEmptyPointsList();
    } else {
      this.#renderSort();
      this.#renderPointsList();
    }
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter(this.#pointsListComponent.element, this.#destinations, this.#offersByType, this.#handlePointChange, this.#handleModeChange);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => this.#renderPoint(point));
  };

  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#container);
    this.#renderPoints();
  };

  #renderEmptyPointsList = () => {
    if (this.#emptyPointsListComponent === null) {
      this.#emptyPointsListComponent = new EmptyPointsListView();
    }
    render(this.#emptyPointsListComponent, this.#container);
  };

  #renderSort = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new SortView();
    }
    render(this.#sortComponent, this.#container);
  };
}
