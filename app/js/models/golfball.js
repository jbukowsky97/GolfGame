import { Group, SphereBufferGeometry, MeshPhongMaterial, Mesh } from 'three';

const BALL_RADIUS = .1;

export default class GolfBall extends Group {
  constructor() {
    super();

    const ballGeometry = new SphereBufferGeometry(BALL_RADIUS);
    const ballMaterial = new MeshPhongMaterial({ color: 0xefefef });
    this.ball = new Mesh(ballGeometry, ballMaterial);
    this.ball.position.set(0, BALL_RADIUS, 0);

    this.add(this.ball);
  }
}