import { render } from '../render';
import NewPoint from '../view/new-point';
import EditPoint from '../view/edit-point';
import PointsList from '../view/points-list';
import Sort from '../view/sort';
import Point from '../view/point';

export default class Trip {
  constructor({ container }) {
    this.component = new PointsList();
    this.container = container;
  }

  init() {
    render(new Sort(), this.container);
    render(this.component, this.container);
    render(new NewPoint(), this.component.getElement());
    render(new EditPoint(), this.component.getElement());

    for (let i = 0; i < 3; i++) {
      render(new Point(), this.component.getElement());
    }
  }
}
