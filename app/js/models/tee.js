import { Group, ConeBufferGeometry, MeshPhongMaterial, Mesh } from 'three';

const TEE_RADIUS = .05;
const TEE_HEIGHT = .5;

export default class Tee extends Group {
  constructor() {
    super();

    const teeGeometry = new ConeBufferGeometry(TEE_RADIUS, TEE_HEIGHT);
    const teeMaterial = new MeshPhongMaterial({ color: 0xafecff });
    this.tee = new Mesh(teeGeometry, teeMaterial);
    this.tee.rotation.x = Math.PI;
    this.tee.position.set(0, 0, 0);
    
    this.add(this.tee);
  }

  getTeeHeight() {
    return TEE_HEIGHT / 2;
  }
}