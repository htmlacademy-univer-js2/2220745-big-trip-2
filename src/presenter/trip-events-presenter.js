import { RenderPosition, render, remove } from '../framework/render';
import { FilterFunctions, SortFunctions } from '../utils';
import { SortType, UserAction, UpdateType, FilterType } from '../const';
import NewPointPresenter from './new-point-presenter';
import PointPresenter from './point-presenter';
import PointsListView from '../view/points-list-view';
import SortView from '../view/sort-view';
import EmptyPointsListView from '../view/empty-points-list-view';
import NewPointButtonView from '../view/new-point-button.view';
import InfoView from '../view/info-view';
import LoadingView from '../view/loading-view';
import ErrorView from '../view/error-view';

export default class Trip {
  #container = null;
  #menuContainer = null;

  #pointsListComponent = new PointsListView();
  #emptyPointsListComponent = new EmptyPointsListView();
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #sortComponent = null;
  #newPointButtonComponent = null;
  #infoComponent = null;

  #pointsModel = null;
  #filtersModel = null;

  #currentSortType = SortType.DAY;
  #isLoading = true;

  #pointPresenter = new Map();
  #newPointPresenter = null;

  constructor({ container, menuContainer, pointsModel, filtersModel }) {
    this.#container = container;
    this.#menuContainer = menuContainer;
    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filterType = this.#filtersModel.filter;
    const filteredPoints = this.#pointsModel.points.filter(FilterFunctions[filterType]);
    return filteredPoints.sort(SortFunctions[this.#currentSortType]);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  init() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    this.#renderPointsList();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointPresenter.init();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList();
        this.#renderPointsList();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        if (this.#pointsModel.errored) {
          this.#renderNewPointButton(true);
          this.#renderError();
        } else {
          this.#createNewPointPresenter();
          this.#renderNewPointButton(false);
          this.#renderPointsList();
        }
        break;
    }
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

  #renderPoints = () => {
    this.points.forEach((point) => this.#renderPoint(point));
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      container: this.#pointsListComponent.element,
      destinations: this.destinations,
      offers: this.offers,
      changeData: this.#handleViewAction,
      changeMode: this.#handleModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #createNewPointPresenter = () => {
    this.#newPointPresenter = new NewPointPresenter({
      newPointContainer: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
      handleChangeData: this.#handleViewAction,
      handleDestroy: this.#handleNewPointClose,
    });
  };

  #clearPointsList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#newPointPresenter.destroy();
    this.#clearInfo();
  };

  #renderEmptyPointsList = () => {
    render(this.#emptyPointsListComponent, this.#container);
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#container);
  };

  #renderError = () => {
    render(this.#errorComponent, this.#container);
  }

  #renderSort = () => {
    if (this.#sortComponent === null) {
      this.#sortComponent = new SortView(this.#handleSortButtonClick);
    }
    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  };

  #renderNewPointButton = (isDisabled) => {
    if (this.#newPointButtonComponent === null) {
      this.#newPointButtonComponent = new NewPointButtonView({ buttonClick: this.#handleNewPointButtonClick, isDisabled: isDisabled });
    }
    render(this.#newPointButtonComponent, this.#menuContainer, RenderPosition.BEFOREEND);
  };

  #renderInfo = () => {
    if (this.#infoComponent === null) {
      this.#infoComponent = new InfoView(this.#pointsModel.points, this.destinations, this.offers);
    }
    render(this.#infoComponent, this.#menuContainer, RenderPosition.AFTERBEGIN);
  };

  #clearInfo = () => {
    remove(this.#infoComponent);
    this.#infoComponent = null;
  };

  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#newPointButtonComponent.element.disabled = true;
  };

  #handleNewPointClose = () => {
    this.#newPointButtonComponent.element.disabled = false;
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
}
