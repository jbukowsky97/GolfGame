import { Group } from 'three';
import HoleOne from './holes/hole_one';
import HoleTwo from './holes/hole_two';

export default class Course extends Group {
  constructor() {
    super();

    this.holeOne = new HoleOne();
    this.holeTwo = new HoleTwo();
    this.holeTwo.rotation.y = Math.PI;
    this.holeTwo.position.set(-150, 0, -600);
    this.holeTwo.placeCoords();

    this.add(this.holeOne);
    this.add(this.holeTwo);

    this.holes = [this.holeOne, this.holeTwo];
    this.currentHole = 1;
  }

  getCurrentHole() {
    return this.holes[this.currentHole];
  }

  nextHole() {
    this.currentHole++;
  }
}