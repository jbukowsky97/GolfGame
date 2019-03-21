import { MeshPhongMaterial, Mesh, Group, BoxBufferGeometry, SphereBufferGeometry, ConeBufferGeometry } from 'three';
import Driver from './driver';

const LEG_HEIGHT = 1.1;
const LEG_WIDTH = .2;
const LEG_OFFSET = .15
const WAIST_WIDTH = LEG_WIDTH + 2 * LEG_OFFSET;
const WAIST_HEIGHT = .3;
const CHEST_HEIGHT = LEG_HEIGHT;
const ARM_WIDTH = .15
const ARM_HEIGHT = CHEST_HEIGHT;
const HEAD_RADIUS = .3;
const BILL_LENGTH = .4;
const BILL_HEIGHT = .05;

const LEG_POSITION_Y = LEG_HEIGHT;
const WAIST_POSITION_Y = LEG_HEIGHT + WAIST_HEIGHT / 2;
const UPPER_BODY_POSITION_Y = LEG_HEIGHT + WAIST_HEIGHT;
const LEFT_ARM_POSITION_X = -WAIST_WIDTH / 2 + -ARM_WIDTH / 2;
const RIGHT_ARM_POSITION_X = WAIST_WIDTH / 2 + ARM_WIDTH / 2;
const ARM_POSITION_Y = ARM_HEIGHT;
const HEAD_POSITION_Y = CHEST_HEIGHT;

const UPPER_BODY_THETA = 0.6;

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

    this.rightArm = new Mesh(armGeometry, armMaterial);
    this.rightArm.position.set(RIGHT_ARM_POSITION_X, ARM_POSITION_Y, 0);

    const headGeometry = new SphereBufferGeometry(HEAD_RADIUS, 18, 16);
    headGeometry.translate(0, HEAD_RADIUS, 0);
    const headMaterial = new MeshPhongMaterial({ color: 0xffd493 });
    this.head = new Mesh(headGeometry, headMaterial);

    const hatConeGeometry = new ConeBufferGeometry(HEAD_RADIUS, HEAD_RADIUS);
    hatConeGeometry.translate(0, 2 * HEAD_RADIUS, 0);
    const hatConeMaterial = new MeshPhongMaterial({ color: 0x2b2b2b });
    this.hatCone = new Mesh(hatConeGeometry, hatConeMaterial);

    const hatBillGeometry = new BoxBufferGeometry(3 / 2 * HEAD_RADIUS, BILL_HEIGHT, BILL_LENGTH);
    hatBillGeometry.translate(0, 3 / 2 * HEAD_RADIUS + BILL_HEIGHT / 2, -HEAD_RADIUS);
    const hatBillMaterial = new MeshPhongMaterial({ color: 0x2b2b2b });
    this.hatBill = new Mesh(hatBillGeometry, hatBillMaterial);

    this.leftArmAndClub = new Group();
    this.leftArmAndClub.position.set(LEFT_ARM_POSITION_X, ARM_POSITION_Y, 0);
    this.leftArmAndClub.add(this.leftArm);

    this.headGroup = new Group();
    this.headGroup.position.set(0, HEAD_POSITION_Y, 0);
    this.headGroup.add(this.head);
    this.headGroup.add(this.hatCone);
    this.headGroup.add(this.hatBill);

    this.upperBodyGroup = new Group();
    this.upperBodyGroup.add(this.chest);
    this.upperBodyGroup.add(this.leftArmAndClub);
    this.upperBodyGroup.add(this.rightArm);
    this.upperBodyGroup.add(this.headGroup);
    this.upperBodyGroup.position.set(0, UPPER_BODY_POSITION_Y, 0);

    this.add(this.leftLeg);
    this.add(this.rightLeg);
    this.add(this.waist);
    this.add(this.upperBodyGroup);

    this.swinging = false;
    this.secondHalfSwing = false;
    this.leftArmTheta = Math.acos(WAIST_WIDTH / 2 / ARM_HEIGHT);
    this.rightArmTheta = this.leftArmTheta;
    this.armOriginalY = ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);

    this.walking = false;

    this.setClock = true;
  }

  neutralPosture() {
    if (this.club) {
      this.leftArmAndClub.remove(this.club);
      this.club = null;
    }

    this.upperBodyGroup.rotation.x = 0.0;
    this.upperBodyGroup.rotation.y = 0.0;
    this.leftArmAndClub.rotation.x = 0.0;
    this.rightArm.rotation.x = 0.0;
    this.leftArmAndClub.rotation.z = 0.0;
    this.rightArm.rotation.z = 0.0;
    this.leftArmAndClub.scale.set(1, 1, 1);
    this.rightArm.scale.set(1, 1, 1);
    this.head.rotation.y = 0.0;
  }

  golfPosture(club) {
    this.club = club;
    this.leftArmAndClub.add(this.club);
    this.club.position.set(.11, -ARM_HEIGHT, 0);

    this.leftArmTheta = Math.acos(WAIST_WIDTH / 2 / ARM_HEIGHT);
    this.rightArmTheta = this.leftArmTheta;
    this.armOriginalY = ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);

    this.upperBodyGroup.rotation.x = -UPPER_BODY_THETA;
    this.upperBodyGroup.rotation.y = 0.0
    this.leftArmAndClub.rotation.x = UPPER_BODY_THETA;
    this.rightArm.rotation.x = UPPER_BODY_THETA;
    this.leftArmAndClub.rotation.z = 1.5708 - this.leftArmTheta;
    this.club.rotation.z = -1.5708 + this.leftArmTheta;
    this.rightArm.rotation.z = -1.5708 + this.rightArmTheta;
    this.leftArm.scale.set(1, 1, 1);
    this.rightArm.scale.set(1, 1, 1);
    this.head.rotation.y = 0.0;
  }

  updateGolfSwing() {
    this.leftArmAndClub.rotation.z = 1.5708 - this.leftArmTheta;
    this.rightArm.rotation.z = -1.5708 + this.rightArmTheta;
    if (this.secondHalfSwing) {
      const leftArmLength = ARM_HEIGHT * Math.sin(this.rightArmTheta) / Math.sin(this.leftArmTheta);
      const leftArmScale = leftArmLength / ARM_HEIGHT;
      this.leftArm.scale.set(1, leftArmScale, 1);
      this.club.position.set(0, -ARM_HEIGHT * leftArmScale, 0);
    } else {
      const rightArmLength = ARM_HEIGHT * Math.sin(this.leftArmTheta) / Math.sin(this.rightArmTheta);
      const rightArmScale = rightArmLength / ARM_HEIGHT;
      this.rightArm.scale.set(1, rightArmScale, 1);
    }
  }

  animate() {
    if ((this.swinging || this.walking) && this.setClock) {
      this.setClock = false;
      this.startClock = new Date().getTime();
      this.prevClock = this.startClock;
    }
    if (this.swinging) {
      this.swing();
    } else if (this.walking) {
      this.walk();
    }
  }

  walk() {
    const currentTime = new Date().getTime();
    const delta = currentTime - this.prevClock;
    this.prevClock = currentTime;
    const ellapsed = currentTime - this.startClock;

    if (ellapsed < 250) {
      const rotationX = 1 * (ellapsed / 250);
      this.leftLeg.rotation.x = rotationX;
      this.rightLeg.rotation.x = -rotationX;
      this.leftArmAndClub.rotation.x = -rotationX;
      this.rightArm.rotation.x = rotationX
    } else if (currentTime - this.startClock < 500) {
      const rotationX = 1 * (1 - (ellapsed - 250) / 250);
      this.leftLeg.rotation.x = rotationX;
      this.rightLeg.rotation.x = -rotationX;
      this.leftArmAndClub.rotation.x = -rotationX;
      this.rightArm.rotation.x = rotationX
    } else if (currentTime - this.startClock < 750) {
      const rotationX = 1 * (ellapsed - 500) / 250;
      this.leftLeg.rotation.x = -rotationX;
      this.rightLeg.rotation.x = rotationX;
      this.leftArmAndClub.rotation.x = rotationX;
      this.rightArm.rotation.x = -rotationX
    } else if (currentTime - this.startClock < 1000) {
      const rotationX = 1 * (1 - (ellapsed - 750) / 250);
      this.leftLeg.rotation.x = -rotationX;
      this.rightLeg.rotation.x = rotationX;
      this.leftArmAndClub.rotation.x = rotationX;
      this.rightArm.rotation.x = -rotationX
    } else {
      this.startClock = currentTime;
    }
  }

  startWalking() {
    this.walking = true;
    this.setClock = true;
  }

  stopWalking() {
    this.walking = false;
  }

  swing() {
    const currentTime = new Date().getTime();
    const delta = currentTime - this.prevClock;
    this.prevClock = currentTime;
    if (currentTime - this.startClock < 1000) {
      const upperBodyRotationY = 0.0016 * delta;
      this.upperBodyGroup.rotation.y -= upperBodyRotationY;
      this.head.rotation.y += upperBodyRotationY;

      this.leftArmAndClub.rotation.x += 0.001 * delta;
      this.rightArm.rotation.x += 0.001 * delta;

      this.leftArmTheta -= 0.001 * delta;
      this.rightArmTheta += 0.001 * delta;

      this.club.rotation.z += 0.002 * delta;

      this.updateGolfSwing();
    } else if (currentTime - this.startClock < 1250) {
      const upperBodyRotationY = 0.0064 * delta;
      this.upperBodyGroup.rotation.y += upperBodyRotationY;
      this.head.rotation.y -= upperBodyRotationY;

      this.leftArmAndClub.rotation.x -= 0.004 * delta;
      this.rightArm.rotation.x -= 0.004 * delta;

      this.leftArmTheta += 0.004 * delta;
      this.rightArmTheta -= 0.004 * delta;

      this.club.rotation.z -= 0.008 * delta;

      this.updateGolfSwing();
    } else if (currentTime - this.startClock < 1500) {
      this.secondHalfSwing = true;

      const upperBodyRotationY = 0.0064 * delta;
      this.upperBodyGroup.rotation.y += upperBodyRotationY;

      this.leftArmAndClub.rotation.x += 0.004 * delta;
      this.rightArm.rotation.x += 0.004 * delta;

      this.leftArmTheta += 0.004 * delta;
      this.rightArmTheta -= 0.004 * delta;

      this.club.rotation.z -= 0.008 * delta;

      this.updateGolfSwing();
    } else {
      this.swinging = false;
      this.secondHalfSwing = false;
      this.setClock = true;
      // this.golfPosture();
    }
  }
}