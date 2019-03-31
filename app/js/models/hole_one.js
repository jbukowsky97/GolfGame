import { Group, BoxBufferGeometry, MeshPhongMaterial, Mesh, FontLoader, TextBufferGeometry, Vector3, BufferGeometry, CylinderBufferGeometry } from 'three';

const FLOOR_HEIGHT = 1;
const FAIRWAY_WIDTH = 70;
const FAIRWAY_DEPTH = 600;
const ROUGH_WIDTH = 30;
const TEE_BOX_WIDTH = 20;
const TEE_BOX_DEPTH = 30;
const GREEN_WIDTH = 50;
const GREEN_DEPTH = 50;
const HOLE_RADIUS = .2;

const TEE_BOX_DIRECTION_Y = 3 * Math.PI / 2;

export default class HoleOne extends Group {
  constructor() {
    super();

    const fairwayGeometry = new BoxBufferGeometry(FAIRWAY_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH);
    fairwayGeometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH / 2 + 2);
    const fairwayMaterial = new MeshPhongMaterial({ color: 0x53e25b });
    this.fairway = new Mesh(fairwayGeometry, fairwayMaterial);

    const roughGeometry = new BoxBufferGeometry(ROUGH_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH);
    roughGeometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH / 2 + 2);
    const roughMaterial = new MeshPhongMaterial({ color: 0x1a4c1c });

    this.leftRough = new Mesh(roughGeometry, roughMaterial);
    this.leftRough.position.set(-FAIRWAY_WIDTH / 2 - ROUGH_WIDTH / 2, 0, 0);

    this.rightRough = new Mesh(roughGeometry, roughMaterial);
    this.rightRough.position.set(FAIRWAY_WIDTH / 2 + ROUGH_WIDTH / 2, 0, 0);

    const teeboxGeometry = new BoxBufferGeometry(TEE_BOX_WIDTH, FLOOR_HEIGHT, TEE_BOX_DEPTH);
    teeboxGeometry.translate(0, -FLOOR_HEIGHT / 2, -TEE_BOX_DEPTH / 2);
    const teeboxMaterial = new MeshPhongMaterial({ color: 0x7ded83 });
    this.teebox = new Mesh(teeboxGeometry, teeboxMaterial);
    this.teebox.position.set(0, 0.01, -5);

    const greenGeometry = new BoxBufferGeometry(GREEN_WIDTH, FLOOR_HEIGHT, GREEN_DEPTH);
    greenGeometry.translate(0, -FLOOR_HEIGHT / 2, 0);
    const greenMaterial = new MeshPhongMaterial({ color: 0x7ded83 });
    this.green = new Mesh(greenGeometry, greenMaterial);

    const holeGeometry = new CylinderBufferGeometry(HOLE_RADIUS, HOLE_RADIUS, FLOOR_HEIGHT, 16);
    holeGeometry.translate(0, -FLOOR_HEIGHT / 2, 0);
    const holeMaterial = new MeshPhongMaterial({ color: 0x000000, transparent: true, opacity: .75 });
    this.hole = new Mesh(holeGeometry, holeMaterial);
    this.hole.position.y = 0.01;
    
    this.greenGroup = new Group();
    this.greenGroup.add(this.green);
    this.greenGroup.add(this.hole);
    this.greenGroup.position.set(0, 0.01, -FAIRWAY_DEPTH + GREEN_DEPTH);

    // const loader = new FontLoader();

    // const _self = this;
    // loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
    //   _self.geometry = new TextBufferGeometry( 'Hello three.js!', {
    //     font: font,
    //     size: 80,
    //     height: 5,
    //     curveSegments: 12,
    //     bevelEnabled: true,
    //     bevelThickness: 10,
    //     bevelSize: 8,
    //     bevelSegments: 5,
    //   } );
    // } );

    // const fudge = new MeshPhongMaterial({ color: 0x1a4c1c });
    // this.text = new Mesh(this.geometry, fudge);
    // this.text.position.y = 0;

    this.add(this.fairway);
    this.add(this.leftRough);
    this.add(this.rightRough);
    this.add(this.teebox);
    this.add(this.greenGroup);
    // this.add(this.text);

    this.teeboxCoords = new Vector3();
    this.teebox.getWorldPosition(this.teeboxCoords);

    this.holeCoords = new Vector3();
    this.greenGroup.getWorldPosition(this.holeCoords);
  }

  getTeeBoxDirection() {
    return TEE_BOX_DIRECTION_Y;
  }

  insideTeeBox(coords) {
    return (coords.x >= this.teeboxCoords.x - TEE_BOX_WIDTH / 2 && coords.x <= this.teeboxCoords.x + TEE_BOX_WIDTH / 2
      && coords.z <= this.teeboxCoords.z && coords.z >= this.teeboxCoords.z - TEE_BOX_DEPTH);
  }

  insideHole(coords, radius) {
    const distance = Math.sqrt(Math.pow(this.holeCoords.z - coords.z, 2), Math.pow(this.holeCoords.x - coords.x, 2));
    return distance <= HOLE_RADIUS - radius && coords.y === 0;
  }
}