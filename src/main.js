import FiltersView from './view/filters-view';
import Trip from './presenter/trip-events-presenter';
import { render } from './render';
import PointModel from './model/points-model';

const pointsModel = new PointModel();
const tripPresenter = new Trip({
  container: document.querySelector('.trip-events'),
});

render(new FiltersView(), document.querySelector('.trip-controls__filters'));
tripPresenter.init(pointsModel);
