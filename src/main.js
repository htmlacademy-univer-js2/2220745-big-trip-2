import Trip from './presenter/trip-events-presenter';
import { render } from './framework/render';
import PointsModel from './model/points-model';
import MenuView from './view/menu-view';
import DestinationsModel from './model/destinations-model';
import OffersByTypeModel from './model/offers-by-type-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersByTypeModel = new OffersByTypeModel();
const filterModel = new FilterModel();

const tripContainer = document.querySelector('.trip-events');
const menuContainer = document.querySelector('.trip-main');

const filtersPresenter = new FilterPresenter({
  filtersContainer: document.querySelector('.trip-controls__filters'),
  pointsModel: pointsModel,
  filterModel: filterModel,
});

const tripPresenter = new Trip({
  container: tripContainer,
  menuContainer: menuContainer,
  pointsModel: pointsModel,
  filtersModel: filterModel,
  destinationsModel: destinationsModel,
  offersByTypeModel: offersByTypeModel,
});

render(new MenuView(), document.querySelector('.trip-controls__navigation'));

tripPresenter.init(pointsModel);
filtersPresenter.init();
