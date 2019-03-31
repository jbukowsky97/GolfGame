import { Group, SphereBufferGeometry, MeshPhongMaterial, Mesh, Vector3 } from 'three';

const BALL_RADIUS = .13;

const RANGE = 5;

const GRAVITY = .008;
const FRICTION = .98;

export default class GolfBall extends Group {
  constructor() {
    super();

    const ballGeometry = new SphereBufferGeometry(BALL_RADIUS);
    const ballMaterial = new MeshPhongMaterial({ color: 0xefefef });
    this.ball = new Mesh(ballGeometry, ballMaterial);
    this.ball.position.set(0, BALL_RADIUS, 0);

    this.add(this.ball);

    this.teed = false;

    this.traveling = false;
  }

  update() {
    // this.position.x += this.speedX;
    // this.position.y += this.speedY;
    // this.position.z += this.speedZ;
    // if (this.position.y === 0) {
    //   this.speedX *= FRICTION;
    //   this.speedZ *= FRICTION;
    //   const absX = Math.abs(this.speedX);
    //   const absZ = Math.abs(this.speedZ);
    //   if (this.position.y === 0 && (absX > 0 || absZ > 0) && absX < 0.1 && absZ < 0.1) {
    //     this.speedX = 0.0;
    //     this.speedZ = 0.0;
    //   }
    // }
    // if (this.position.y > 0 && !this.teed) {
    //   this.speedY = this.speedY - GRAVITY;
    // } else if (this.position.y < 0) {
    //   this.position.y = 0;
    //   this.speedY = 0.0;
    //   this.speedX = 0.0;
    //   this.speedZ = 0.0;
    // }
    if (this.traveling) {
      const currentTime = new Date().getTime();
      const ellapsed = currentTime - this.startClock;
      if (ellapsed < this.time) {
        this.position.x = this.initialPosition.x + this.distanceX * ellapsed / this.time;
        this.position.z = this.initialPosition.z + this.distanceZ * ellapsed / this.time;
        this.position.y = this.initialPosition.y + this.height * (-4 * Math.pow(ellapsed / this.time, 2) + 4 * ellapsed / this.time);
      } else {
        this.position.x = this.initialPosition.x + this.distanceX;
        this.position.z = this.initialPosition.z + this.distanceZ;
        this.position.y = 0;
        this.traveling = false;
      }
    }
  }

  setTravel(distance, angle, height, time) {
    this.teed = false;
    this.distanceX = distance * -Math.cos(angle);
    this.distanceZ = distance * Math.sin(angle);
    this.height = height;
    this.time = time;
    this.initialPosition = { ...this.position };
    this.traveling = true;
    this.startClock = new Date().getTime();
  }

  withinRange(coords) {
    const ballCoords = new Vector3();
    this.ball.getWorldPosition(ballCoords);

    const distance = Math.sqrt(Math.pow(coords.x - ballCoords.x, 2) + Math.pow(coords.z - ballCoords.z, 2));
    return distance < RANGE;
  }
}