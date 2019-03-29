import { Group, SphereBufferGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';

const BALL_RADIUS = .13;

const RANGE = 5;

const GRAVITY = .008;
const FRICTION = .00001;

export default class GolfBall extends Group {
  constructor() {
    super();

    const ballGeometry = new SphereBufferGeometry(BALL_RADIUS);
    const ballMaterial = new MeshPhongMaterial({ color: 0xefefef });
    this.ball = new Mesh(ballGeometry, ballMaterial);
    this.ball.position.set(0, BALL_RADIUS, 0);

    this.add(this.ball);

    this.teed = false;

    this.speedX = 0.0;
    this.speedY = 0.0;
    this.speedZ = 0.0;
  }

  update() {
    this.position.x += this.speedX;
    this.position.y += this.speedY;
    this.position.z += this.speedZ;
    if (this.position.y > 0 && !this.teed) {
      this.speedY = this.speedY - GRAVITY;
    } else if (this.position.y < 0) {
      this.position.y = 0;
      this.speedY = 0.0;
      this.speedX = 0.0;
      this.speedY = 0.0;
      this.speedZ = 0.0;
    }
  }

  setSpeed(x, y, z) {
    this.teed = false;
    this.speedX = x;
    this.speedY = y;
    this.speedZ = z;
  }

  withinRange(coords) {
    const ballCoords = new Vector3();
    this.ball.getWorldPosition(ballCoords);

    const distance = Math.sqrt(Math.pow(coords.x - ballCoords.x, 2) + Math.pow(coords.z - ballCoords.z, 2));
    return distance < RANGE;
  }
}