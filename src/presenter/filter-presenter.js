import { FilterType, UpdateType } from '../const';
import { remove, replace, render } from '../framework/render';
import { FilterFunctions } from '../utils';
import FiltersView from '../view/filters-view';

export default class FilterPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #pointsModel = null;

  #filtersComponent = null;

  constructor({ filtersContainer, filterModel, pointsModel }) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        isEmpty: points.filter(FilterFunctions[FilterType.EVERYTHING]).length === 0,
      },
      {
        type: FilterType.FUTURE,
        isEmpty: points.filter(FilterFunctions[FilterType.FUTURE]).length === 0,
      },
      {
        type: FilterType.PAST,
        isEmpty: points.filter(FilterFunctions[FilterType.PAST]).length === 0,
      },
    ];
  }

  init() {
    const prevFilterComponent = this.#filtersComponent;
    this.#filtersComponent = new FiltersView(this.filters, this.#filterModel.filter, this.#handleFilterClick);

    if (!prevFilterComponent) {
      render(this.#filtersComponent, this.#filtersContainer);
      return;
    }
    replace(this.#filtersComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterClick = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
