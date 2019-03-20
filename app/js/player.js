import { MeshPhongMaterial, Mesh, Group, CylinderBufferGeometry, BoxBufferGeometry} from 'three';

const LEG_HEIGHT = .8;
const LEG_WIDTH = .2;
const LEG_OFFSET = .15
const WAIST_WIDTH = LEG_WIDTH + 2 * LEG_OFFSET;
const WAIST_HEIGHT = .3;
const CHEST_HEIGHT = WAIST_HEIGHT + LEG_HEIGHT;
const ARM_WIDTH = .15
const ARM_HEIGHT = CHEST_HEIGHT;

const LEG_POSITION_Y = LEG_HEIGHT;
const WAIST_POSITION_Y = LEG_HEIGHT + WAIST_HEIGHT / 2;
const UPPER_BODY_POSITION_Y = LEG_HEIGHT + WAIST_HEIGHT;
const LEFT_ARM_POSITION_X = -WAIST_WIDTH / 2 + -ARM_WIDTH / 2;
const RIGHT_ARM_POSITION_X = WAIST_WIDTH / 2 + ARM_WIDTH / 2;
const ARM_POSITION_Y = ARM_HEIGHT;

const UPPER_BODY_THETA = 0.5;
const CHEST_SHIFT_Z = -CHEST_HEIGHT / 4 * Math.cos(UPPER_BODY_THETA);
const CHEST_SHIFT_Y = -CHEST_HEIGHT / 4 * Math.sin(UPPER_BODY_THETA);
const ARM_SHIFT_Z = CHEST_SHIFT_Z;

export default class Player extends Group {
  constructor() {
    super();

    const legGeometry = new BoxBufferGeometry(LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH);
    legGeometry.translate(0, -LEG_HEIGHT / 2, 0);
    const legMaterial = new MeshPhongMaterial({ color: 0x2b2b2b });

    this.leftLeg = new Mesh(legGeometry, legMaterial);
    this.leftLeg.position.set(-LEG_OFFSET, LEG_POSITION_Y, 0);

    this.rightLeg = new Mesh(legGeometry, legMaterial);
    this.rightLeg.position.set(LEG_OFFSET, LEG_POSITION_Y, 0);

    const waistGeometry = new BoxBufferGeometry(WAIST_WIDTH, WAIST_HEIGHT, LEG_WIDTH);
    const waistMaterial = new MeshPhongMaterial({ color: 0x2b2b2b });
    this.waist = new Mesh(waistGeometry, waistMaterial);
    this.waist.position.set(0, WAIST_POSITION_Y, 0);

    const chestGeometry = new BoxBufferGeometry(WAIST_WIDTH, CHEST_HEIGHT, LEG_WIDTH);
    chestGeometry.translate(0, CHEST_HEIGHT / 2, 0);
    const chestMaterial = new MeshPhongMaterial({ color: 0xff0000 });
    this.chest = new Mesh(chestGeometry, chestMaterial);

    const armGeometry = new BoxBufferGeometry(ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH);
    armGeometry.translate(0, -ARM_HEIGHT / 2, 0);
    const armMaterial = new MeshPhongMaterial({ color: 0xff0000 });

    this.leftArm = new Mesh(armGeometry, armMaterial);
    this.leftArm.position.set(LEFT_ARM_POSITION_X, ARM_POSITION_Y, 0);

    this.rightArm = new Mesh(armGeometry, armMaterial);
    this.rightArm.position.set(RIGHT_ARM_POSITION_X, ARM_POSITION_Y, 0);

    this.upperBodyGroup = new Group();
    this.upperBodyGroup.add(this.chest);
    this.upperBodyGroup.add(this.leftArm);
    this.upperBodyGroup.add(this.rightArm);
    this.upperBodyGroup.position.set(0, UPPER_BODY_POSITION_Y, 0);

    this.add(this.leftLeg);
    this.add(this.rightLeg);
    this.add(this.waist);
    this.add(this.upperBodyGroup);

    this.swinging = false;
    this.secondHalfSwing = false;
    this.setClock = true;
    this.swingCounter = 0;
    this.leftArmTheta = Math.acos(WAIST_WIDTH / 2 / ARM_HEIGHT);
    this.rightArmTheta = this.leftArmTheta;
    this.armOriginalY = ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);
  }

  neutralPosture() {
    this.upperBodyGroup.rotation.x = 0.0;
    this.upperBodyGroup.rotation.y = 0.0;
    this.leftArm.rotation.x = 0.0;
    this.rightArm.rotation.x = 0.0;
    this.leftArm.rotation.z = 0.0;
    this.rightArm.rotation.z = 0.0;
    this.rightArm.scale.set(1, 1, 1);
  }

  golfPosture() {
    this.leftArmTheta = Math.acos(WAIST_WIDTH / 2 / ARM_HEIGHT);
    this.rightArmTheta = this.leftArmTheta;
    this.armOriginalY = ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);

    this.upperBodyGroup.rotation.x = -UPPER_BODY_THETA;
    this.upperBodyGroup.rotation.y = 0.0
    this.leftArm.rotation.x = UPPER_BODY_THETA;
    this.rightArm.rotation.x = UPPER_BODY_THETA;
    this.leftArm.rotation.z = 1.5708 - this.leftArmTheta;
    this.rightArm.rotation.z = -1.5708 + this.rightArmTheta;
    this.rightArm.scale.set(1, 1, 1);
  }

  updateGolfSwing() {
    this.leftArm.rotation.z = 1.5708 - this.leftArmTheta;
    this.rightArm.rotation.z = -1.5708 + this.rightArmTheta;
    if (this.secondHalfSwing) {
      const leftArmLength = ARM_HEIGHT * Math.sin(this.rightArmTheta) / Math.sin(this.leftArmTheta);
      const leftArmScale = leftArmLength / ARM_HEIGHT;
      this.leftArm.scale.set(1, leftArmScale, 1);
    } else {
      const rightArmLength = ARM_HEIGHT * Math.sin(this.leftArmTheta) / Math.sin(this.rightArmTheta);
      const rightArmScale = rightArmLength / ARM_HEIGHT;
      this.rightArm.scale.set(1, rightArmScale, 1);
    }
  }

  animate() {
    if (this.swinging) {
      if (this.setClock) {
        this.setClock = false;
        this.swingStartClock = new Date().getTime();
        this.prevClock = this.swingStartClock;
      }
      this.swing();
    }
  }

  swing() {
    const currentTime = new Date().getTime();
    const delta = currentTime - this.prevClock;
    this.prevClock = currentTime;
    if (this.swingCounter < 100) {
      this.upperBodyGroup.rotation.y -= 0.017;

      this.leftArm.rotation.x += 0.01;
      this.rightArm.rotation.x += 0.01;

      this.leftArmTheta -= 0.006;
      this.rightArmTheta += 0.006;
      this.updateGolfSwing();
    } else if (this.swingCounter < 120) {
      this.upperBodyGroup.rotation.y += 0.085;

      this.leftArm.rotation.x -= 0.05;
      this.rightArm.rotation.x -= 0.05;

      this.leftArmTheta += 0.030;
      this.rightArmTheta -= 0.030;
      this.updateGolfSwing();
    } else if (this.swingCounter < 140) {
      this.secondHalfSwing = true;

      this.upperBodyGroup.rotation.y += 0.085;

      this.leftArm.rotation.x += 0.05;
      this.rightArm.rotation.x += 0.05;

      this.leftArmTheta += 0.030;
      this.rightArmTheta -= 0.030;
      this.updateGolfSwing();
    } else {
      this.swinging = false;
      this.secondHalfSwing = false;
      this.swingCounter = 0;
      // this.golfPosture();
    }
    this.swingCounter++;
  }
}