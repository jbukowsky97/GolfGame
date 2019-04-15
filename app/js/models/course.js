import { Group, BoxBufferGeometry, MeshPhongMaterial, Mesh, Vector3, TextureLoader, RepeatWrapping } from 'three';
import HoleOne from './holes/hole_one';
import HoleTwo from './holes/hole_two';
import HoleThree from './holes/hole_three';

const FLOOR_WIDTH = 1000;
const FLOOR_HEIGHT = 1;
const FLOOR_DEPTH = 640;

export default class Course extends Group {
  constructor() {
    super();

    const floorGeometry = new BoxBufferGeometry(FLOOR_WIDTH, FLOOR_HEIGHT, FLOOR_DEPTH);
    floorGeometry.translate(0, -FLOOR_HEIGHT / 2, -FLOOR_DEPTH / 2);
    const floorMesh = new MeshPhongMaterial({ color: 0x593b00 });
    this.floor = new Mesh(floorGeometry, floorMesh);
    this.floor.position.set(0, -0.1, 10);

    this.holeOne = new HoleOne();
    this.holeOne.placeCoords();

    this.holeTwo = new HoleTwo();
    this.holeTwo.rotation.y = Math.PI;
    this.holeTwo.position.set(-150, 0, -600);
    this.holeTwo.placeCoords();

    this.holeThree = new HoleThree();
    this.holeThree.rotation.y = -Math.PI / 2;
    this.holeThree.position.set(-425, 0, -160);
    this.holeThree.placeCoords();

    this.add(this.floor);
    this.add(this.holeOne);
    this.add(this.holeTwo);
    this.add(this.holeThree);

    this.holes = [this.holeOne, this.holeTwo, this.holeThree];
    this.currentHole = 0;

    const floorCoords = this.floor.position;
    this.floorSquare = {
      left: floorCoords.x - FLOOR_WIDTH / 2,
      right: floorCoords.x + FLOOR_WIDTH / 2,
      front: floorCoords.z,
      back: floorCoords.z - FLOOR_DEPTH,
    };
  }

  keepWithin(object) {
    if (!this.withinFloor(object.position.x, object.position.z)) {
      object.position.x = Math.min(this.floorSquare.right,
        Math.max(this.floorSquare.left, object.position.x));
      object.position.z = Math.min(this.floorSquare.front,
        Math.max(this.floorSquare.back, object.position.z));
    }
  }

  withinFloor(x, z) {
    return (x >= this.floorSquare.left && x <= this.floorSquare.right
      && z <= this.floorSquare.front && z >= this.floorSquare.back);
  }

  getCurrentHole() {
    return this.holes[this.currentHole];
  }

  nextHole() {
    this.currentHole++;
  }
}