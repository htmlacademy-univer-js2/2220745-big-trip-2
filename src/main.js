import { render } from './framework/render';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import NavigationView from './view/navigation-view';
import Trip from './presenter/trip-events-presenter';
import FilterPresenter from './presenter/filter-presenter';
import PointsApiService from './points-api-service';

const AUTHORIZATION = 'Basic sr014kll5dp';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip/';
const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const tripContainer = document.querySelector('.trip-events');
const menuContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const navigationContainer = document.querySelector('.trip-controls__navigation');


const pointsModel = new PointsModel({
  pointsApiService: pointsApiService,
});
const filterModel = new FilterModel();

const filtersPresenter = new FilterPresenter({
  filtersContainer: filtersContainer,
  pointsModel: pointsModel,
  filterModel: filterModel,
});

const tripPresenter = new Trip({
  container: tripContainer,
  menuContainer: menuContainer,
  pointsModel: pointsModel,
  filtersModel: filterModel,
});

render(new NavigationView(), navigationContainer);

pointsModel.init();
tripPresenter.init();
filtersPresenter.init();
