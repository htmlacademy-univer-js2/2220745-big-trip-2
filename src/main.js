import Trip from './presenter/trip-events-presenter';
import { render, RenderPosition } from './framework/render';
import PointModel from './model/points-model';
import MenuView from './view/menu-view';
import FiltersView from './view/filters-view';
import InfoView from './view/info-view';

const pointsModel = new PointModel();
const tripPresenter = new Trip(document.querySelector('.trip-events'), pointsModel);

render(new MenuView(), document.querySelector('.trip-controls__navigation'));
render(new FiltersView(pointsModel.points), document.querySelector('.trip-controls__filters'));
render(new InfoView(pointsModel.points, pointsModel.destinations), document.querySelector('.trip-main'), RenderPosition.AFTERBEGIN);

tripPresenter.init(pointsModel);
