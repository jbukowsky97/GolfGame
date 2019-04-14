import { Group, MeshPhongMaterial, Mesh, CylinderBufferGeometry, ConeBufferGeometry } from 'three';

export default class Arrow extends Group {
  constructor(SHAFT_RADIUS, SHAFT_HEIGHT, HEAD_RADIUS, COLOR) {
    super();

    const arrowMaterial = new MeshPhongMaterial({ color: COLOR });

    const shaftGeometry = new CylinderBufferGeometry(SHAFT_RADIUS, SHAFT_RADIUS, SHAFT_HEIGHT, 20);
    shaftGeometry.translate(0, SHAFT_HEIGHT / 2, 0);
    this.shaft = new Mesh(shaftGeometry, arrowMaterial);

    const headGeometry = new ConeBufferGeometry(HEAD_RADIUS, SHAFT_HEIGHT / 2, 20);
    headGeometry.translate(0, 5 / 4 * SHAFT_HEIGHT, 0);
    this.head = new Mesh(headGeometry, arrowMaterial);

    this.add(this.shaft);
    this.add(this.head);
  }
}