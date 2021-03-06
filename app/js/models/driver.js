import { MeshPhongMaterial, Mesh, Group, CylinderBufferGeometry, BoxBufferGeometry, SphereBufferGeometry, Shape, ExtrudeBufferGeometry} from 'three';
import Club from './club';

const SHAFT_RADIUS_TOP = 0.028;
const SHAFT_RADIUS_BOTTOM = 0.025
const SHAFT_HEIGHT = 1;
const GRIP_HEIGHT = 0.4;
const GRIP_RADIUS_TOP = 0.032;
const GRIP_RADIUS_BOTTOM = 0.03;

const DRIVER_WIDTH = .4;
const DRIVER_HEIGHT_MIDDLE = .25
const DRIVER_THICKNESS = .2;

const HEAD_ROTATION_Z = 0.4;
const HEAD_ROTATION_X = 0.15;

const DRIVER_DISTANCE = 385;
const DRIVER_HEIGHT = 40;
const DRIVER_TIME = 6000;

export default class Driver extends Club {
  constructor() {
    super();

    const gripGeometry = new CylinderBufferGeometry(GRIP_RADIUS_TOP, GRIP_RADIUS_BOTTOM, GRIP_HEIGHT);
    const gripMaterial = new MeshPhongMaterial({ color: 0x282828 });

    this.grip = new Mesh(gripGeometry, gripMaterial);

    const shaftGeometry = new CylinderBufferGeometry(SHAFT_RADIUS_TOP, SHAFT_RADIUS_BOTTOM, SHAFT_HEIGHT);
    const shaftMaterial = new MeshPhongMaterial({ color: 0xe8e8e8 });

    this.shaft = new Mesh(shaftGeometry, shaftMaterial);
    this.shaft.position.set(0, -SHAFT_HEIGHT / 2 - GRIP_HEIGHT / 2, 0);

    const headShape = new Shape();
    headShape.moveTo(0, 0);
    headShape.lineTo(DRIVER_WIDTH / 3, -DRIVER_HEIGHT_MIDDLE / 2);
    headShape.lineTo(DRIVER_WIDTH * 2 / 3, -DRIVER_HEIGHT_MIDDLE / 2);
    headShape.lineTo(DRIVER_WIDTH, 0);
    headShape.lineTo(DRIVER_WIDTH * 2 / 3, DRIVER_HEIGHT_MIDDLE / 2);
    headShape.lineTo(DRIVER_WIDTH / 3, DRIVER_HEIGHT_MIDDLE / 2);
    headShape.lineTo(0, 0);

    const headSettings = {
      steps: 2,
      depth: DRIVER_THICKNESS,
      bevelEnabled: false
    };

    const headGeometry = new ExtrudeBufferGeometry( headShape, headSettings );
    const headMaterial = new MeshPhongMaterial( { color: 0xe8e8e8 } );
    this.head = new Mesh(headGeometry, headMaterial);
    this.head.rotation.x = HEAD_ROTATION_X;

    this.headGroup = new Group();
    this.headGroup.add(this.head);
    this.headGroup.position.set(-SHAFT_RADIUS_BOTTOM / 2, -SHAFT_HEIGHT - GRIP_HEIGHT / 2, -SHAFT_RADIUS_BOTTOM / 2);
    this.headGroup.rotation.z = -HEAD_ROTATION_Z;

    this.driverGroup = new Group();
    this.driverGroup.add(this.grip);
    this.driverGroup.add(this.shaft);
    this.driverGroup.add(this.headGroup);

    this.driverGroup.rotation.z = HEAD_ROTATION_Z;
    this.driverGroup.rotation.y = Math.PI / 2;

    this.add(this.driverGroup);
  }

  getName() {
    return 'Driver';
  }

  getDistance() {
    return DRIVER_DISTANCE;
  }
  
  getHeight() {
    return DRIVER_HEIGHT;
  }

  getTime() {
    return DRIVER_TIME;
  }
}