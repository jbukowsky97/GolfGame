import * as THREE from 'three';
import Player from './player';

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 5;

    this.player = new Player();
    this.player.neutralPosture();
    // this.player.golfPosture();
    // this.player.swinging = true;

    this.scene.add( this.player );

    // const lightOne = new THREE.DirectionalLight (0xFFFFFF, 1.0);
    // lightOne.position.set (10, 40, 100);
    // this.scene.add (lightOne); 

    // window.addEventListener('resize', () => this.resizeHandler());

    // this.resizeHandler();
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.player.rotation.y -= 0.01;
    // this.player.rotation.y = 4.5;
    // this.player.animate();

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