import * as THREE from 'three';
import Player from './models/player';
import Driver from './models/driver';

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xe2fdff );
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;
    this.camera.position.y = 2;

    this.driver = new Driver();

    this.player = new Player();
    // this.player.neutralPosture();
    // this.player.startWalking();
    this.player.golfPosture(this.driver);
    this.player.swinging = true;

    this.scene.add(this.player);
    // this.scene.add(this.driver);

    this.ambientLight = new THREE.AmbientLight( 0x404040 );
    this.scene.add( this.ambientLight );

    this.hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    this.scene.add( this.hemisphereLight );

    // const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
    // lightOne.position.set (10, 40, 100);
    // this.scene.add (lightOne); 

    // window.addEventListener('resize', () => this.resizeHandler());

    // this.resizeHandler();
    requestAnimationFrame(() => this.render());

    this.player.rotation.y = 3;
  }

  render() {
    // this.player.rotation.y -= 0.01;
    
    this.player.animate();

    this.renderer.render( this.scene, this.camera );

    requestAnimationFrame(() => this.render());
  }

  // resizeHandler() {
  //   const canvas = document.getElementById("mycanvas");
  //   let w = window.innerWidth - 16;
  //   let h = 0.75 * w;  /* maintain 4:3 ratio */
  //   if (canvas.offsetTop + h > window.innerHeight) {
  //     h = window.innerHeight - canvas.offsetTop - 16;
  //     w = 4/3 * h;
  //   }
  //   canvas.width = w;
  //   canvas.height = h;
  //   this.camera.updateProjectionMatrix();
  //   this.renderer.setSize(w, h);
  //   this.tracker.handleResize();
  // }
}