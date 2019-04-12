import { Group, BoxBufferGeometry, MeshPhongMaterial, Mesh, Vector3, CylinderBufferGeometry, Shape, ExtrudeBufferGeometry } from 'three';

const FLOOR_HEIGHT = 1;
const FAIRWAY_WIDTH = 70;
const FAIRWAY_DEPTH = 260;
const FAIRWAY_DEPTH_2 = 240 + FAIRWAY_WIDTH;
const ROUGH_WIDTH = 30;
const TEE_BOX_WIDTH = 20;
const TEE_BOX_DEPTH = 30;
const GREEN_WIDTH = 50;
const GREEN_DEPTH = 50;
const HOLE_RADIUS = .2;
const FLAG_POLE_RADIUS = HOLE_RADIUS / 2;
const FLAG_POLE_HEIGHT = 6;
const FLAG_HEIGHT = 1;
const FLAG_DEPTH = 1;
const FLAG_THICKNESS = FLAG_POLE_RADIUS;

export default class HoleTwo extends Group {
  constructor() {
    super();

    const fairwayGeometry = new BoxBufferGeometry(FAIRWAY_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH);
    fairwayGeometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH / 2);
    const fairwayMaterial = new MeshPhongMaterial({ color: 0x53e25b });
    this.fairway = new Mesh(fairwayGeometry, fairwayMaterial);

    const fairway2Geometry = new BoxBufferGeometry(FAIRWAY_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH_2);
    fairway2Geometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH_2 / 2);
    this.fairway2 = new Mesh(fairway2Geometry, fairwayMaterial);
    this.fairway2.rotation.y = -Math.PI / 2;
    this.fairway2.position.set(-FAIRWAY_WIDTH / 2, 0, -FAIRWAY_DEPTH - FAIRWAY_WIDTH / 2);

    const roughMaterial = new MeshPhongMaterial({ color: 0x1a4c1c });

    const leftRoughGeometry = new BoxBufferGeometry(ROUGH_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH + FAIRWAY_WIDTH);
    leftRoughGeometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH / 2 - FAIRWAY_WIDTH / 2);
    this.leftRough = new Mesh(leftRoughGeometry, roughMaterial);
    this.leftRough.position.set(-FAIRWAY_WIDTH / 2 - ROUGH_WIDTH / 2, 0, 0);

    const rightRoughGeometry = new BoxBufferGeometry(ROUGH_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH);
    rightRoughGeometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH / 2);
    this.rightRough = new Mesh(rightRoughGeometry, roughMaterial);
    this.rightRough.position.set(FAIRWAY_WIDTH / 2 + ROUGH_WIDTH / 2, 0, 0);

    const leftRough2Geometry = new BoxBufferGeometry(ROUGH_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH_2 + ROUGH_WIDTH);
    leftRough2Geometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH_2 / 2 - ROUGH_WIDTH / 2);
    this.leftRough2 = new Mesh(leftRough2Geometry, roughMaterial);
    this.leftRough2.rotation.y = -Math.PI / 2;
    this.leftRough2.position.set(-FAIRWAY_WIDTH / 2 - ROUGH_WIDTH, 0, -FAIRWAY_DEPTH - FAIRWAY_WIDTH - ROUGH_WIDTH / 2)

    const rightRough2Geometry = new BoxBufferGeometry(ROUGH_WIDTH, FLOOR_HEIGHT, FAIRWAY_DEPTH_2 - FAIRWAY_WIDTH - ROUGH_WIDTH);
    rightRough2Geometry.translate(0, -FLOOR_HEIGHT / 2, -FAIRWAY_DEPTH_2 / 2 + FAIRWAY_WIDTH / 2 + ROUGH_WIDTH / 2);
    this.rightRough2 = new Mesh(rightRough2Geometry, roughMaterial);
    this.rightRough2.rotation.y = -Math.PI / 2;
    this.rightRough2.position.set(FAIRWAY_WIDTH / 2 + ROUGH_WIDTH, 0, -FAIRWAY_DEPTH + ROUGH_WIDTH / 2)

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

    const flagPoleGeometry = new CylinderBufferGeometry(FLAG_POLE_RADIUS, FLAG_POLE_RADIUS, FLAG_POLE_HEIGHT, 16);
    flagPoleGeometry.translate(0, FLAG_POLE_HEIGHT / 2, 0);
    const flagPoleMaterial = new MeshPhongMaterial({ color: 0xffffff });
    this.flagPole = new Mesh(flagPoleGeometry, flagPoleMaterial);

    const flagShape = new Shape();
    flagShape.moveTo(0, 0);
    flagShape.lineTo(0, FLAG_HEIGHT);
    flagShape.lineTo(FLAG_DEPTH, FLAG_HEIGHT / 2);
    flagShape.lineTo(0, 0);

    const flagSettings = {
      steps: 2,
      depth: FLAG_THICKNESS,
      bevelEnabled: false
    };

    const flagGeometry = new ExtrudeBufferGeometry( flagShape, flagSettings );
    flagGeometry.translate(0, -FLAG_HEIGHT, -FLAG_THICKNESS / 2);
    const flagMaterial = new MeshPhongMaterial({ color: 0xff0000 });
    this.flag = new Mesh(flagGeometry, flagMaterial);
    this.flag.position.set(0, FLAG_POLE_HEIGHT, 0);

    this.flagGroup = new Group();
    this.flagGroup.add(this.flagPole);
    this.flagGroup.add(this.flag);

    this.greenGroup = new Group();
    this.greenGroup.add(this.green);
    this.greenGroup.add(this.hole);
    this.greenGroup.add(this.flagGroup);
    this.greenGroup.position.set(FAIRWAY_DEPTH_2 - FAIRWAY_WIDTH, 0.01, -FAIRWAY_DEPTH - FAIRWAY_WIDTH / 2);

    this.add(this.fairway);
    this.add(this.fairway2);
    this.add(this.leftRough);
    this.add(this.rightRough);
    this.add(this.leftRough2);
    this.add(this.rightRough2);
    this.add(this.teebox);
    this.add(this.greenGroup);

    this.holeCoords = new Vector3();

    this.flagIn = true;
  }

  placeCoords() {
    const worldCoords = new Vector3();
    this.getWorldPosition(worldCoords);

    const teeboxCoords = new Vector3();
    teeboxCoords.x = worldCoords.x + this.teebox.position.x;
    teeboxCoords.z = worldCoords.z - this.teebox.position.z;
    this.teeboxSquare = {
      left: teeboxCoords.x - TEE_BOX_WIDTH / 2,
      right: teeboxCoords.x + TEE_BOX_WIDTH / 2,
      front: teeboxCoords.z + TEE_BOX_DEPTH,
      back: teeboxCoords.z,
    };
    
    const greenCoords = new Vector3();
    greenCoords.x = worldCoords.x - this.greenGroup.position.x;
    greenCoords.z = worldCoords.z - this.greenGroup.position.z;
    this.greenSquare = {
      left: greenCoords.x - GREEN_WIDTH / 2,
      right: greenCoords.x + GREEN_WIDTH / 2,
      front: greenCoords.z + GREEN_DEPTH / 2,
      back: greenCoords.z - GREEN_DEPTH / 2,
    };

    this.holeCoords.x += greenCoords.x;
    this.holeCoords.z += greenCoords.z;

    this.holeSquare = {
      left: worldCoords.x - FAIRWAY_WIDTH / 2 - ROUGH_WIDTH,
      right: worldCoords.x + FAIRWAY_WIDTH / 2 + ROUGH_WIDTH,
      front: worldCoords.z + FAIRWAY_DEPTH + FAIRWAY_WIDTH + ROUGH_WIDTH,
      back: woorldCoords.z,
    };

    this.holeSquare2 = {
      left: woorldCoords.x + FAIRWAY_WIDTH / 2 - FAIRWAY_DEPTH_2,
      right: woorldCoords.x + FAIRWAY_WIDTH / 2 + ROUGH_WIDTH,
      front: worldCoords.z + FAIRWAY_DEPTH + FAIRWAY_WIDTH + ROUGH_WIDTH,
      back: woorldCoords.z + FAIRWAY_DEPTH - ROUGH_WIDTH,
    };
  }
  
  withinHole(object) {
    return this.insideHole(object.position, this.holeSquare);
  }

  insideSquare(coords, square) {
    return (coords.x >= square.left && coords.x <= square.right
      && coords.z <= square.front && coords.z >= square.back);
  }

  insideTeeBox(coords) {
    return this.insideSquare(coords, this.teeboxSquare);
  }

  onGreen(coords) {
    if (this.insideSquare(coords, this.greenSquare)) {
      if (this.flagIn) {
        this.flagIn = false;
        this.greenGroup.remove(this.flagGroup);
      }
    } else {
      if (!this.flagIn) {
        this.flagIn = true;
        this.greenGroup.add(this.flagGroup);
      }
    }
  }

  insideHole(coords, radius) {
    const distance = Math.sqrt(Math.pow(this.holeCoords.z - coords.z, 2), Math.pow(this.holeCoords.x - coords.x, 2));
    return distance <= HOLE_RADIUS - radius && coords.y === 0;
  }
}