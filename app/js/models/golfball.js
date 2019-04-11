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
    
    this.live = false;

    this.ballCoords = new Vector3();

    this.inHole = false;
  }

  getHeight(x) {
    return this.height * (-4 * Math.pow(x, 2) + 4 * x);
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
    this.ball.getWorldPosition(this.ballCoords);
    if (this.traveling) {
      const currentTime = new Date().getTime();
      const ellapsed = currentTime - this.startClock;
      if (ellapsed / this.time >= this.ratioCrossedHole) {
        this.inHole = true;
        this.traveling = false;
      }
      if (ellapsed < this.time) {
        this.position.x = this.initialPosition.x + this.distanceX * ellapsed / this.time;
        this.position.z = this.initialPosition.z + this.distanceZ * ellapsed / this.time;
        this.position.y = this.initialPosition.y + this.getHeight(ellapsed / this.time);
      } else {
        this.position.x = this.initialPosition.x + this.distanceX;
        this.position.z = this.initialPosition.z + this.distanceZ;
        this.position.y = 0;
        this.traveling = false;
      }
    }
  }

  setTarget(hole, holeRadius = .2) {
    this.targetHole = hole;
    this.targetHoleRadius = holeRadius;
  }

  setTravel(distance, angle, height, time) {
    this.teed = false;
    this.distance = distance;
    this.distanceX = distance * -Math.cos(angle);
    this.distanceZ = distance * Math.sin(angle);
    this.height = height;
    this.time = time;
    this.initialPosition = { ...this.position };
    this.finalPosition = new Vector3(this.initialPosition.x + this.distanceX, this.initialPosition.y, this.initialPosition.z + this.distanceZ);
    this.traveling = true;
    this.startClock = new Date().getTime();
    this.ratioCrossedHole = this.timeCrossedHole();
  }

  distanceTo(coords) {
    return Math.sqrt(Math.pow(coords.x - this.ballCoords.x, 2) + Math.pow(coords.z - this.ballCoords.z, 2));
  }

  withinRange(coords, distance = undefined) {
    if (!distance) {
      distance = this.distanceTo(coords);
    }
    return distance < RANGE;
  }

  timeCrossedHole() {
    const slope = (this.finalPosition.z - this.initialPosition.z) / (this.finalPosition.x - this.initialPosition.x);
    const b = this.initialPosition.z - slope * this.initialPosition.x;
    const perpSlope = -1 / slope;
    const perpB = this.targetHole.z - perpSlope * this.targetHole.x;
    const xCoefficient = slope - perpSlope;
    const bDiff = perpB - b;
    const crossX = bDiff / xCoefficient;
    const crossZ = slope * crossX + b;
    const distance = Math.sqrt(Math.pow(crossZ - this.targetHole.z, 2), Math.pow(crossX - this.targetHole.x, 2));
    const distanceFromInitial = Math.sqrt(Math.pow(this.targetHole.z - this.initialPosition.z, 2), Math.pow(this.targetHole.x - this.initialPosition.x, 2));
    const ratio = distanceFromInitial / this.distance;
    console.log(distance, this.targetHoleRadius, ratio, this.getHeight(ratio));
    if (distance < this.targetHoleRadius && ratio <= 1 + this.targetHoleRadius && this.getHeight(ratio) <= 0.0) {
      console.log(distanceFromInitial / (this.distance + this.targetHoleRadius));
      return distanceFromInitial / (this.distance + this.targetHoleRadius);
    } else {
      return undefined;
    }
  }
}