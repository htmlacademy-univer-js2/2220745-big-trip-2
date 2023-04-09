import { render } from './framework/render';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import MenuView from './view/menu-view';
import Trip from './presenter/trip-events-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic sr013klzbdp';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel({
  pointsApiService: pointsApiService,
});
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
});

render(new MenuView(), document.querySelector('.trip-controls__navigation'));

pointsModel.init();
tripPresenter.init();
filtersPresenter.init();
