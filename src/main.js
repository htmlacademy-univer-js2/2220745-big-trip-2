import Filters from './view/filters';
import Trip from './presenter/trip-events-presenter';
import { render } from './render';

const tripPresenter = new Trip({
  container: document.querySelector('.trip-events'),
});

render(new Filters(), document.querySelector('.trip-controls__filters'));
tripPresenter.init();
