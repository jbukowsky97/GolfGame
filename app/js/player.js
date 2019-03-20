import { MeshBasicMaterial, MeshPhongMaterial, Mesh, Group, CylinderBufferGeometry, BoxBufferGeometry} from 'three';

const LEG_HEIGHT = .8;
const LEG_WIDTH = .2;
const LEG_OFFSET = .15
const WAIST_WIDTH = LEG_WIDTH + 2 * LEG_OFFSET;
const WAIST_HEIGHT = .3;
const CHEST_HEIGHT = WAIST_HEIGHT + LEG_HEIGHT;
const ARM_WIDTH = .15
const ARM_HEIGHT = CHEST_HEIGHT;

const LEG_POSITION_Y = LEG_HEIGHT / 2;
const WAIST_POSITION_Y = LEG_HEIGHT + WAIST_HEIGHT / 2;
const UPPER_BODY_POSITION_Y = LEG_HEIGHT + WAIST_HEIGHT + CHEST_HEIGHT / 2;
const LEFT_ARM_POSITION_X = -WAIST_WIDTH / 2 + -ARM_WIDTH / 2;
const RIGHT_ARM_POSITION_X = WAIST_WIDTH / 2 + ARM_WIDTH / 2;

const UPPER_BODY_THETA = 0.5;
const CHEST_SHIFT_Z = -CHEST_HEIGHT / 4 * Math.cos(UPPER_BODY_THETA);
const CHEST_SHIFT_Y = -CHEST_HEIGHT / 4 * Math.sin(UPPER_BODY_THETA);
const ARM_SHIFT_Z = CHEST_SHIFT_Z;

export default class Player extends Group {
  constructor() {
    super();

    const legGeometry = new BoxBufferGeometry( LEG_WIDTH, LEG_HEIGHT, LEG_WIDTH );
    const legMaterial = new MeshBasicMaterial( {color: 0xffffff} );

    this.leftLeg = new Mesh( legGeometry, legMaterial );
    this.leftLeg.position.set(-LEG_OFFSET, LEG_POSITION_Y, 0);

    this.rightLeg = new Mesh( legGeometry, legMaterial );
    this.rightLeg.position.set(LEG_OFFSET, LEG_POSITION_Y, 0);

    const waistGeometry = new BoxBufferGeometry( WAIST_WIDTH, WAIST_HEIGHT, LEG_WIDTH );
    const waistMaterial = new MeshBasicMaterial( {color: 0xffffff} );
    this.waist = new Mesh( waistGeometry, waistMaterial );
    this.waist.position.set(0, WAIST_POSITION_Y, 0);

    const chestGeometry = new BoxBufferGeometry( WAIST_WIDTH, CHEST_HEIGHT, LEG_WIDTH );
    const chestMaterial = new MeshBasicMaterial( {color: 0xff0000} );
    this.chest = new Mesh( chestGeometry, chestMaterial );

    const armGeometry = new BoxBufferGeometry( ARM_WIDTH, ARM_HEIGHT, ARM_WIDTH );
    const armMaterial = new MeshBasicMaterial( {color: 0xff00ff} );

    this.leftArm = new Mesh( armGeometry, armMaterial );
    this.leftArm.position.set(LEFT_ARM_POSITION_X, 0, 0);

    this.rightArm = new Mesh( armGeometry, armMaterial );
    this.rightArm.position.set(RIGHT_ARM_POSITION_X, 0, 0);

    this.armGroup = new Group();
    this.armGroup.add(this.leftArm);
    this.armGroup.add(this.rightArm);

    this.upperBodyGroup = new Group();
    this.upperBodyGroup.add(this.chest);
    this.upperBodyGroup.add(this.armGroup);
    this.upperBodyGroup.position.set(0, UPPER_BODY_POSITION_Y, 0);

    this.add(this.leftLeg);
    this.add(this.rightLeg);
    this.add(this.waist);
    this.add(this.upperBodyGroup);

    this.swinging = false;
    this.swingCounter = 0;
    console.log(WAIST_WIDTH);
    console.log(ARM_HEIGHT);
    this.leftArmTheta = Math.acos(WAIST_WIDTH / 2 / ARM_HEIGHT);
    console.log(this.leftArmTheta);
    this.rightArmTheta = this.leftArmTheta;
    this.armOriginalY = ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);
  }

  neutralPosture() {
    this.chest.rotation.x = 0.0;
    this.chest.rotation.z = 0.0;
    this.chest.position.set(0, 0, 0);
    this.armGroup.position.set(0, 0, 0);
    this.leftArm.rotation.z = 0.0;
    this.leftArm.position.set(LEFT_ARM_POSITION_X, 0, 0);
    this.rightArm.rotation.z = 0.0;
    this.rightArm.position.set(RIGHT_ARM_POSITION_X, 0, 0);
  }

  golfPosture() {
    this.upperBodyGroup.rotation.x = -UPPER_BODY_THETA;
    this.upperBodyGroup.rotation.z = 0.0;
    this.upperBodyGroup.position.set(0, UPPER_BODY_POSITION_Y, CHEST_SHIFT_Z);
    this.armGroup.rotation.x = UPPER_BODY_THETA;
    this.armGroup.position.set(0, 0, ARM_SHIFT_Z);
    this.leftArm.rotation.z = 1.5708 - this.leftArmTheta;
    const leftArmX = ARM_HEIGHT / 2 * Math.cos(this.leftArmTheta);
    const leftArmY = this.armOriginalY - ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);
    this.leftArm.position.set(LEFT_ARM_POSITION_X + leftArmX, leftArmY, 0);
    this.rightArm.rotation.z = -1.5708 + this.rightArmTheta;
    const rightArmX = ARM_HEIGHT / 2 * Math.cos(this.rightArmTheta);
    const rightArmY = this.armOriginalY - ARM_HEIGHT / 2 * Math.sin(this.rightArmTheta);
    const rightArmLength = ARM_HEIGHT * Math.sin(this.leftArmTheta) / Math.sin(this.rightArmTheta);
    const rightArmScale = rightArmLength / ARM_HEIGHT;
    this.rightArm.scale.set(1, rightArmScale, 1);
    const shiftLength = (ARM_HEIGHT - rightArmLength) / 2;
    const shiftLengthX = shiftLength * Math.cos(this.rightArmTheta);
    const shiftLengthY = shiftLength * Math.sin(this.rightArmTheta);
    this.rightArm.position.set(RIGHT_ARM_POSITION_X - rightArmX + shiftLengthX, rightArmY + shiftLengthY, 0);
  }

  updateGolfSwing() {
    this.leftArm.rotation.z = 1.5708 - this.leftArmTheta;
    const leftArmX = ARM_HEIGHT / 2 * Math.cos(this.leftArmTheta);
    const leftArmY = this.armOriginalY - ARM_HEIGHT / 2 * Math.sin(this.leftArmTheta);
    this.leftArm.position.set(LEFT_ARM_POSITION_X + leftArmX, leftArmY, 0);
    this.rightArm.rotation.z = -1.5708 + this.rightArmTheta;
    const rightArmX = ARM_HEIGHT / 2 * Math.cos(this.rightArmTheta);
    const rightArmY = this.armOriginalY - ARM_HEIGHT / 2 * Math.sin(this.rightArmTheta);
    const rightArmLength = ARM_HEIGHT * Math.sin(this.leftArmTheta) / Math.sin(this.rightArmTheta);
    const rightArmScale = rightArmLength / ARM_HEIGHT;
    this.rightArm.scale.set(1, rightArmScale, 1);
    const shiftLength = (ARM_HEIGHT - rightArmLength) / 2;
    const shiftLengthX = shiftLength * Math.cos(this.rightArmTheta);
    const shiftLengthY = shiftLength * Math.sin(this.rightArmTheta);
    this.rightArm.position.set(RIGHT_ARM_POSITION_X - rightArmX + shiftLengthX, rightArmY + shiftLengthY, 0);
  }

  animate() {
    if (this.swinging) {
      this.swing();
    }
  }

  swing() {
    if (this.swingCounter < 200) {
      // this.upperBodyGroup.rotation.y -= 0.01;
      // this.armGroup.rotation.x += 0.01;
      // this.armGroup.position.y += 0.004;
      // this.armGroup.position.z -= 0.0015;
      this.leftArmTheta -= 0.004;
      this.rightArmTheta += 0.004;
      this.updateGolfSwing();
    } else if (this.swingCounter < 200) {
      // this.upperBodyGroup.rotation.y += 0.03;
      // this.armGroup.rotation.x -= 0.03;
      // this.armGroup.position.y -= 0.012;
      // this.armGroup.position.z += 0.0045;
    } else {
      this.swinging = false;
      this.swingCounter = 0;
      // this.golfPosture();
    }
    this.swingCounter++;
  }
}