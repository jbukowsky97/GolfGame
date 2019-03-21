import { Group, BoxBufferGeometry, MeshPhongMaterial, Mesh } from 'three';

const FAIRWAY_WIDTH = 30;
const FAIRWAY_HEIGHT = 1;
const FAIRWAY_DEPTH = 100;

export default class HoleOne extends Group {
  constructor() {
    super();

    const fairwayGeometry = new BoxBufferGeometry(FAIRWAY_WIDTH, FAIRWAY_HEIGHT, FAIRWAY_DEPTH);
    fairwayGeometry.translate(0, -FAIRWAY_HEIGHT / 2, 0);
    const fairwayMaterial = new MeshPhongMaterial({ color: 0x53e25b });
    this.fairway = new Mesh(fairwayGeometry, fairwayMaterial);

    this.add(this.fairway);
  }
}