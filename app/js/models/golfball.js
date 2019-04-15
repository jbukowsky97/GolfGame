import { Group, SphereBufferGeometry, MeshPhongMaterial, Mesh, Vector3, TextureLoader, RepeatWrapping } from 'three';
import Arrow from './arrow';

const BALL_RADIUS = .13;

const RANGE = 5;

export default class GolfBall extends Group {
  constructor(wind) {
    super();

    const golfballTexture = new TextureLoader().load( "textures/golf_ball_texture.jpeg" );

    const ballGeometry = new SphereBufferGeometry(BALL_RADIUS);
    const ballMaterial = new MeshPhongMaterial({ color: 0xefefef, map: golfballTexture });
    this.ball = new Mesh(ballGeometry, ballMaterial);
    this.ball.position.set(0, BALL_RADIUS, 0);

    this.ballArrow = new Arrow(2, 10, 4, 0x165687);
    this.ballArrow.rotation.z = Math.PI;
    this.ballArrow.position.y = 50;

    this.add(this.ball);

    this.wind = {
      x: wind.x / 100.0,
      z: wind.z / 100.0,
    };

    this.traveling = false;
    this.setArrow(true);
    
    this.live = false;

    this.ballCoords = new Vector3();

    this.inHole = false;
  }

  setArrow(visible) {
    if (visible) {
      this.add(this.ballArrow);
    } else {
      this.remove(this.ballArrow);
    }
  }

  getHeight(x) {
    return this.height * (-4 * Math.pow(x, 2) + 4 * x);
  }

  getWindX(x) {
    return this.windX * Math.pow(x, 3);
  }

  getWindZ(x) {
    return this.windZ * Math.pow(x, 3);
  }

  update() {
  this.ballCoords = this.position;
    if (this.traveling) {
      const currentTime = new Date().getTime();
      const ellapsed = currentTime - this.startClock;
      if (ellapsed / this.time >= this.ratioCrossedHole) {
        this.inHole = true;
        this.traveling = false;
        this.setArrow(true);
      }
      if (ellapsed < this.time) {
        this.position.x = this.initialPosition.x + this.distanceX * ellapsed / this.time + this.getWindX(ellapsed / this.time);
        this.position.z = this.initialPosition.z + this.distanceZ * ellapsed / this.time + this.getWindZ(ellapsed / this.time);
        this.position.y = this.initialPosition.y + this.getHeight(ellapsed / this.time);
      } else {
        this.position.x = this.finalPosition.x;
        this.position.z = this.finalPosition.z;
        this.position.y = 0;
        this.traveling = false;
        this.setArrow(true);
      }
    }
  }

  setTarget(hole, holeRadius = .2) {
    this.targetHole = hole;
    this.targetHoleRadius = holeRadius;
  }

  setTravel(distance, angle, height, time, wind) {
    this.distance = distance;
    this.distanceX = distance * -Math.cos(angle);
    this.distanceZ = distance * Math.sin(angle);
    if (wind) {
      this.windX = Math.abs(distance) * this.wind.x;
      this.windZ = Math.abs(distance) * this.wind.z;
    } else {
      this.windX = 0;
      this.windZ = 0;
    }
    this.height = height;
    this.time = time;
    this.initialPosition = { ...this.position };
    this.finalPosition = new Vector3(this.initialPosition.x + this.distanceX + this.windX, this.initialPosition.y, this.initialPosition.z + this.distanceZ + this.windZ);
    this.traveling = true;
    this.setArrow(false);
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
    let slope = (this.finalPosition.z - this.initialPosition.z) / (this.finalPosition.x - this.initialPosition.x);
    const b = this.initialPosition.z - slope * this.initialPosition.x;
    let perpSlope = -1 / slope;
    if (Math.abs(slope) === Infinity) {
      slope = Math.sign(slope) * 1000000;
    }
    if (Math.abs(perpSlope) === Infinity) {
      perpSlope = Math.sign(perpSlope) * 1000000;
    }
    const perpB = this.targetHole.z - perpSlope * this.targetHole.x;
    const xCoefficient = slope - perpSlope;
    const bDiff = perpB - b;
    const crossX = bDiff / xCoefficient;
    const crossZ = slope * crossX + b;
    const distance = Math.sqrt(Math.pow(crossZ - this.targetHole.z, 2) + Math.pow(crossX - this.targetHole.x, 2));
    const distanceFromInitial = Math.sqrt(Math.pow(this.targetHole.z - this.initialPosition.z, 2) + Math.pow(this.targetHole.x - this.initialPosition.x, 2));
    const ratio = distanceFromInitial / this.distance;
    if (distance < this.targetHoleRadius && ratio <= 1 + this.targetHoleRadius && this.getHeight(ratio) <= 0.0 && distanceFromInitial / (this.distance + this.targetHoleRadius) >= 0.3) {
      return distanceFromInitial / (this.distance + this.targetHoleRadius);
    } else {
      return undefined;
    }
  }
}