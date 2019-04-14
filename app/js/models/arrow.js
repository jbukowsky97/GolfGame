import { Group, MeshPhongMaterial, Mesh, CylinderBufferGeometry, ConeBufferGeometry } from 'three';

const SHAFT_RADIUS = 10;
const SHAFT_HEIGHT = 50;

const HEAD_RADIUS = 20;

export default class Arrow extends Group {
  constructor() {
    super();

    const arrowMaterial = new MeshPhongMaterial({ color: 0x871616 });

    const shaftGeometry = new CylinderBufferGeometry(SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 20);
    shaftGeometry.translate(0, SHAFT_HEIGHT / 2, 0);
    this.shaft = new Mesh(shaftGeometry, arrowMaterial);

    const headGeometry = new ConeBufferGeometry(HEAD_RADIUS, SHAFT_HEIGHT / 2, 20);
    headGeometry.translate(0, 5 / 4 * SHAFT_HEIGHT, 0);
    this.head = new Mesh(headGeometry, arrowMaterial);

    this.add(this.shaft);
    this.add(this.head);

    this.rotation.x = -Math.PI / 2;
  }
}