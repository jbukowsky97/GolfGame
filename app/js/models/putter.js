import { MeshPhongMaterial, Mesh, Group, CylinderBufferGeometry, Shape, ExtrudeBufferGeometry, BoxBufferGeometry} from 'three';
import Club from './club';

const SHAFT_RADIUS_TOP = 0.028;
const SHAFT_RADIUS_BOTTOM = 0.025
const SHAFT_HEIGHT = 1.1;
const GRIP_HEIGHT = 0.4;
const GRIP_RADIUS_TOP = 0.032;
const GRIP_RADIUS_BOTTOM = 0.03;

const PUTTER_WIDTH = .4;
const PUTTER_HEIGHT_MIDDLE = .15
const PUTTER_THICKNESS = .1;

const HEAD_ROTATION_Z = 0.4;
const HEAD_ROTATION_X = 0.05;

const PUTTER_DISTANCE = 27.5;
const PUTTER_HEIGHT = 0;
const PUTTER_TIME = 1000;

export default class Putter extends Club {
  constructor() {
    super();

    const gripGeometry = new CylinderBufferGeometry(GRIP_RADIUS_TOP, GRIP_RADIUS_BOTTOM, GRIP_HEIGHT);
    const gripMaterial = new MeshPhongMaterial({ color: 0x282828 });

    this.grip = new Mesh(gripGeometry, gripMaterial);

    const shaftGeometry = new CylinderBufferGeometry(SHAFT_RADIUS_TOP, SHAFT_RADIUS_BOTTOM, SHAFT_HEIGHT);
    const shaftMaterial = new MeshPhongMaterial({ color: 0xe8e8e8 });

    this.shaft = new Mesh(shaftGeometry, shaftMaterial);
    this.shaft.position.set(0, -SHAFT_HEIGHT / 2 - GRIP_HEIGHT / 2, 0);

    const headGeometry = new BoxBufferGeometry(PUTTER_WIDTH, PUTTER_HEIGHT_MIDDLE, PUTTER_THICKNESS);
    const headMaterial = new MeshPhongMaterial( { color: 0xe8e8e8 } );
    this.head = new Mesh(headGeometry, headMaterial) ;
    this.head.position.set(PUTTER_WIDTH / 2 - SHAFT_RADIUS_BOTTOM / 2, -SHAFT_HEIGHT - GRIP_HEIGHT / 2, 0);
    this.head.rotation.z = -HEAD_ROTATION_Z;
    this.head.rotation.x = HEAD_ROTATION_X;

    this.driverGroup = new Group();
    this.driverGroup.add(this.grip);
    this.driverGroup.add(this.shaft);
    this.driverGroup.add(this.head);

    this.driverGroup.rotation.z = HEAD_ROTATION_Z;
    this.driverGroup.rotation.y = 1.5708;

    this.add(this.driverGroup);
  }

  getName() {
    return 'Putter';
  }

  getDistance() {
    return PUTTER_DISTANCE;
  }

  getHeight() {
    return PUTTER_HEIGHT;
  }

  getTime() {
    return PUTTER_TIME;
  }
}