import { RenderPosition, render, remove } from '../framework/render';
import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import PointPresenter from './point-presenter';
import { FilterFunctions, SortFunctions } from '../utils';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import NewPointPresenter from './new-point-presenter';
import NewPointButtonView from '../view/new-point-button.view';
import InfoView from '../view/info-view';

export default class Trip {
  #container = null;
  #menuContainer = null;

  #pointsListComponent = new PointsListView();
  #sortComponent = null;
  #emptyPointsListComponent = null;
  #newPointButtonComponent = null;
  #infoComponent = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersByTypeModel = null;
  #filtersModel = null;
  #currentSortType = SortType.DAY;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  constructor({ container, menuContainer, pointsModel, filtersModel, destinationsModel, offersByTypeModel }) {
    this.#container = container;
    this.#menuContainer = menuContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersByTypeModel = offersByTypeModel;
    this.#newPointPresenter = new NewPointPresenter({
      newPointContainer: this.#pointsListComponent.element,
      pointsModel: pointsModel,
      destinationsModel: destinationsModel,
      offersByTypeModel: offersByTypeModel,
      handleChangeData: this.#handleViewAction,
      handleDestroy: this.#handleNewPointClose,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filtersModel.filter;
    const filteredPoints = this.#pointsModel.points.filter(FilterFunctions[filterType]);
    return filteredPoints.sort(SortFunctions[this.#currentSortType]);
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offersByType() {
    return this.#offersByTypeModel.offersByType;
  }

  init() {
    this.#renderMenu();
    this.#renderPointsList();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleSortButtonClick = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointsList();
    this.#renderPointsList();
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#clearInfo();
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointsListComponent.element,
      destinations: this.destinations,
      offersByType: this.offersByType,
      changeData: this.#handleViewAction,
      changeMode: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderPointsList = () => {
    render(this.#pointsListComponent, this.#container);
    if (this.points.length === 0) {
      remove(this.#sortComponent);
      this.#renderEmptyPointsList();
    } else {
      remove(this.#emptyPointsListComponent);
      this.#renderSort();
      this.#renderInfo();
      this.#renderPoints();
    }
  };

  #renderEmptyPointsList = () => {
    if (this.#emptyPointsListComponent === null) {
      this.#emptyPointsListComponent = new EmptyPointsListView();
    }
    render(this.#emptyPointsListComponent, this.#container);
  };

  #renderSort = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new SortView(this.#handleSortButtonClick);
    }
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderMenu = () => {
    this.#renderNewPointButton();
    this.#renderInfo();
  };

  #renderNewPointButton = () => {
    if (this.#newPointButtonComponent === null) {
      this.#newPointButtonComponent = new NewPointButtonView({ buttonClick: this.#handleNewPointButtonClick });
    }
    render(this.#newPointButtonComponent, this.#menuContainer, RenderPosition.BEFOREEND);
  };

  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };

  #renderInfo = () => {
    if (this.#infoComponent === null) {
      this.#infoComponent = new InfoView(this.#pointsModel.points, this.destinations);
    }
    render(this.#infoComponent, this.#menuContainer, RenderPosition.AFTERBEGIN);
  };

  #clearInfo = () => {
    remove(this.#infoComponent);
    this.#infoComponent = null;
  };
}
