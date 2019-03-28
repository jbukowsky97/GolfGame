import { Group, BoxBufferGeometry, MeshPhongMaterial, Mesh, FontLoader, TextBufferGeometry, Vector3 } from 'three';

const FLOOR_HEIGHT = 1;
const FAIRWAY_WIDTH = 50;
const FAIRWAY_DEPTH = 600;
const ROUGH_WIDTH = 30;
const TEE_BOX_WIDTH = 20;
const TEE_BOX_DEPTH = 30;


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
    // this.add(this.text);
  }

  insideTeeBox(coords) {
    const teeboxCoords = new Vector3();
    this.teebox.getWorldPosition(teeboxCoords);
    if (coords.x >= teeboxCoords.x - TEE_BOX_WIDTH / 2 && coords.x <= teeboxCoords.x + TEE_BOX_WIDTH / 2
      && coords.z <= teeboxCoords.z && coords.z >= teeboxCoords.z - TEE_BOX_DEPTH) {
      return true;
    }
    return false;
  }
}