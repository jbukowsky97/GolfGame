import { MeshPhongMaterial, Mesh, Group, CylinderBufferGeometry, BoxBufferGeometry, SphereBufferGeometry, Shape, ExtrudeBufferGeometry} from 'three';
import Club from './club';

const SHAFT_RADIUS_TOP = 0.028;
const SHAFT_RADIUS_BOTTOM = 0.025
// const SHAFT_HEIGHT = 1.1;
const SHAFT_HEIGHT = .9;
const GRIP_HEIGHT = 0.4;
const GRIP_RADIUS_TOP = 0.032;
const GRIP_RADIUS_BOTTOM = 0.03;

const WEDGE_WIDTH = .33;
const WEDGE_HEIGHT_MIDDLE = .2
const WEDGE_THICKNESS = .1;

const HEAD_ROTATION_Z = 0.5;
const HEAD_ROTATION_X = 0.15;

const WEDGE_SPEED = .5;
const WEDGE_HEIGHT = 1;

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

    var headShape = new Shape();
    headShape.moveTo(0, 0);
    headShape.lineTo(WEDGE_WIDTH / 3, -WEDGE_HEIGHT_MIDDLE / 2);
    headShape.lineTo(WEDGE_WIDTH * 2 / 3, -WEDGE_HEIGHT_MIDDLE / 2);
    headShape.lineTo(WEDGE_WIDTH, 0);
    headShape.lineTo(WEDGE_WIDTH * 2 / 3, WEDGE_HEIGHT_MIDDLE / 2);
    headShape.lineTo(WEDGE_WIDTH / 3, WEDGE_HEIGHT_MIDDLE / 2);
    headShape.lineTo(0, 0);

    var headSettings = {
      steps: 2,
      depth: WEDGE_THICKNESS,
      bevelEnabled: false
    };

    const headGeometry = new ExtrudeBufferGeometry( headShape, headSettings );
    const headMaterial = new MeshPhongMaterial( { color: 0xff0000 } ); //0xe8e8e8
    this.head = new Mesh(headGeometry, headMaterial) ;
    this.head.position.set(-SHAFT_RADIUS_BOTTOM / 2, -SHAFT_HEIGHT - GRIP_HEIGHT / 2, -WEDGE_THICKNESS / 2);
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

  getSpeed() {
    return WEDGE_SPEED;
  }

  getHeight() {
    return WEDGE_HEIGHT;
  }
}