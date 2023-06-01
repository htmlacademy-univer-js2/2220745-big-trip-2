import AbsractView from '../framework/view/abstract-view';
import { upperCaseFirst } from '../utils';

const createFilterItemTemplate = (filter, currentFilter) => `
    <div class="trip-filters__filter">
      <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
      ${filter.type === currentFilter ? 'checked' : ''} ${filter.isEmpty ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${filter.type}" data-name="${filter.type}" 
      data-disabled="${filter.isEmpty ? 'true' : 'false'}">${upperCaseFirst(filter.type)}</label>
    </div>
  `;

const createFiltersTemplate = (filters, currentFilter) => {
  const filterItemsTemplate = filters.map((filter) => createFilterItemTemplate(filter, currentFilter)).join('');
  return `
  <form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class FiltersView extends AbsractView {
  #filters = null;
  #currentFilter = null;
  #filterChange = null;

  constructor(filters, currentFilter, filterChange) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#filterChange = filterChange;

    this.element.addEventListener('click', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    if (evt.target.tagName === 'LABEL' && event.target.dataset.disabled === 'false') {
      this.#filterChange(evt.target.dataset.name);
    }
  };
}
