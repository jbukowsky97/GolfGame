import { Group, BoxBufferGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';
import HoleOne from './holes/hole_one';
import HoleTwo from './holes/hole_two';

const FLOOR_WIDTH = 1000;
const FLOOR_HEIGHT = 1;
const FLOOR_DEPTH = 2000;

export default class Course extends Group {
  constructor() {
    super();

    const floorGeometry = new BoxBufferGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, FLOOR_DEPTH);
    floorGeometry.translate(0, -FLOOR_HEIGHT / 2, 0);
    const floorMesh = new MeshPhongMaterial({ color: 0x593b00 });
    this.floor = new Mesh(floorGeometry, floorMesh);
    this.floor.position.y = -0.01;

    this.holeOne = new HoleOne();
    this.holeTwo = new HoleTwo();
    this.holeTwo.rotation.y = Math.PI;
    this.holeTwo.position.set(-150, 0, -600);
    this.holeTwo.placeCoords();

    this.add(this.floor);
    this.add(this.holeOne);
    this.add(this.holeTwo);

    this.holes = [this.holeOne, this.holeTwo];
    this.currentHole = 0;

    const floorCoords = new Vector3();
    this.floor.getWorldPosition(floorCoords);
    
  }

  // withinFloor(x, z) {
  //   return (x >= square.left && coords.x <= square.right
  //     && coords.z <= square.back && coords.z >= square.front);
  // }

  getCurrentHole() {
    return this.holes[this.currentHole];
  }

  nextHole() {
    this.currentHole++;
  }
}