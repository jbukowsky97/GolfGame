import { MeshPhongMaterial, Mesh, Group, CylinderBufferGeometry, BoxBufferGeometry, SphereBufferGeometry, Shape, ExtrudeBufferGeometry} from 'three';
import Club from './club';

const SHAFT_RADIUS_TOP = 0.028;
const SHAFT_RADIUS_BOTTOM = 0.025
const SHAFT_HEIGHT = 1.1;
const GRIP_HEIGHT = 0.4;
const GRIP_RADIUS_TOP = 0.032;
const GRIP_RADIUS_BOTTOM = 0.03;

const WEDGE_WIDTH = .4;
const WEDGE_HEIGHT_MIDDLE = .2;
const WEDGE_HEIGHT_END = .2;
const WEDGE_THICKNESS = .05;

const HEAD_ROTATION_Z = 0.4;
const HEAD_ROTATION_X = 0.98;

const WEDGE_DISTANCE = 138;
const WEDGE_HEIGHT = 70;
const WEDGE_TIME = 3500;

export default class Wedge extends Club {
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
    headShape.lineTo(WEDGE_WIDTH / 2, WEDGE_HEIGHT_MIDDLE);
    headShape.lineTo(WEDGE_WIDTH, WEDGE_HEIGHT_END);
    headShape.lineTo(WEDGE_WIDTH, 0);
    headShape.lineTo(0, 0);

    const headSettings = {
      steps: 2,
      depth: WEDGE_THICKNESS,
      bevelEnabled: false
    };

    const headGeometry = new ExtrudeBufferGeometry( headShape, headSettings );
    const headMaterial = new MeshPhongMaterial( { color: 0xe8e8e8 } );
    this.head = new Mesh(headGeometry, headMaterial) ;
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
    return 'Wedge';
  }

  getDistance() {
    return WEDGE_DISTANCE;
  }

  getHeight() {
    return WEDGE_HEIGHT;
  }

  getTime() {
    return WEDGE_TIME;
  }
}