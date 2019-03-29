import * as THREE from 'three';
import Player from './models/player';
import Driver from './models/driver';
import Wedge from './models/wedge';
import HoleOne from './models/hole_one';
import { Vector3 } from 'three';
import GolfBall from './models/golfball';
import Tee from './models/tee';

const PLAYER_SPEED = 0.04;
const PLAYER_ROTATION_SPEED = 0.0015;
const GAME_STATE = [
  'PLACE_BALL',
  'LIVE_BALL',
  'READY',
];

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xe2fdff );
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    this.camera.position.z = 8;
    this.camera.position.y = 4;

    this.state = 0;

    this.driver = new Driver();
    this.wedge = new Wedge();
    this.ball = new GolfBall();
    this.tee = new Tee();

    this.player = new Player(this.camera);
    this.player.neutralPosture();
    this.player.updateClub(this.driver);
    // this.player.startWalking();
    // this.player.golfPosture(this.driver);
    // this.player.swinging = true;

    this.holeOne = new HoleOne;

    this.scene.add(this.player);
    this.scene.add(this.holeOne);
    // this.scene.add(this.ball);
    // this.scene.add(this.tee);

    // this.ball.position.y = this.tee.getTeeHeight();

    this.ambientLight = new THREE.AmbientLight( 0x404040 );
    this.scene.add( this.ambientLight );

    this.hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    this.scene.add( this.hemisphereLight );

    this.keys = new Array();
    this.actionUp = true;

    const _self = this;
    document.addEventListener("keydown", onKeyDown, false);
    function onKeyDown(event) {
      const keyCode = event.which;
      if (keyCode === 49) {
        _self.player.updateClub(_self.driver);
      } else if (keyCode === 50) {
        _self.player.updateClub(_self.wedge);
      } else if (!_self.keys.includes(keyCode)) {
        _self.keys.push(keyCode);
      }
    };
    document.addEventListener("keyup", onKeyUp, false);
    function onKeyUp(event) {
      const keyCode = event.which;
      if (keyCode === 69) {
        _self.actionUp = true;
      }
      _self.keys = _self.keys.filter(kc => kc != keyCode);
    }

    // window.addEventListener('resize', () => this.resizeHandler());

    // this.resizeHandler();
    requestAnimationFrame(() => this.render());

    // this.player.rotation.y = 3;
    this.prevTime = new Date().getTime();
  }

  render() {
    const currentTime = new Date().getTime();
    const delta = currentTime - this.prevTime;
    this.prevTime = currentTime;

    if (this.keys.includes(87) && !this.keys.includes(83) && this.player.finishedSwing) {
      if (!this.player.walking) {
        this.player.startWalking(true);
      }
      const worldDirection = new Vector3();
      this.player.getWorldDirection(worldDirection);
      const signX = worldDirection.x < 0 ? -1 : 1;
      const signZ = worldDirection.z < 0 ? -1 : 1;
      worldDirection.x = Math.abs(worldDirection.x);
      worldDirection.z = Math.abs(worldDirection.z);
      const dx = signX * PLAYER_SPEED * worldDirection.x / (worldDirection.x + worldDirection.z) * delta;
      const dz = signZ * PLAYER_SPEED * worldDirection.z / (worldDirection.x + worldDirection.z) * delta;
      this.player.position.x -= dx;
      this.player.position.z -= dz;
    } else if (this.keys.includes(83) && !this.keys.includes(87) && this.player.finishedSwing) {
      if (!this.player.walking) {
        this.player.startWalking(false);
      }
      const worldDirection = new Vector3();
      this.player.getWorldDirection(worldDirection);
      const signX = worldDirection.x < 0 ? -1 : 1;
      const signZ = worldDirection.z < 0 ? -1 : 1;
      worldDirection.x = Math.abs(worldDirection.x);
      worldDirection.z = Math.abs(worldDirection.z);
      const dx = signX * PLAYER_SPEED * worldDirection.x / (worldDirection.x + worldDirection.z) * delta;
      const dz = signZ * PLAYER_SPEED * worldDirection.z / (worldDirection.x + worldDirection.z) * delta;
      this.player.position.x += dx;
      this.player.position.z += dz;
    } else {
      if (this.player.walking) {
        this.player.stopWalking();
      }
    }
    if (this.keys.includes(65)) {
      this.player.rotation.y += PLAYER_ROTATION_SPEED * delta;
    }
    if (this.keys.includes(68)) {
      this.player.rotation.y -= PLAYER_ROTATION_SPEED * delta;
    }
    if (this.keys.includes(69) && this.actionUp) {
      this.actionUp = false;
      if (GAME_STATE[this.state] === 'PLACE_BALL') {
        const playerCoords = new Vector3();
        this.player.getWorldPosition(playerCoords);
        if (this.holeOne.insideTeeBox(playerCoords)) {
          this.state++;
          this.tee.position.set(playerCoords.x, 0, playerCoords.z);
          this.ball.teed = true;
          this.ball.position.set(playerCoords.x, this.tee.getTeeHeight(), playerCoords.z);
          this.scene.add(this.tee);
          this.scene.add(this.ball);
        }
      } else if (GAME_STATE[this.state] === 'LIVE_BALL') {
        const playerCoords = new Vector3();
        this.player.getWorldPosition(playerCoords);
        if (this.ball.withinRange(playerCoords)) {
          this.state++;
          this.player.golfPosture();
          this.player.rotation.y = this.holeOne.getTeeBoxDirection();
          const ballCoords = new Vector3();
          this.ball.getWorldPosition(ballCoords);
          
          this.player.position.set(ballCoords.x, 0, ballCoords.z);
        }
      } else if (GAME_STATE[this.state] === 'READY') {
        this.state--;
        const playerDirection = new Vector3();
        this.player.getWorldDirection(playerDirection);
        const signX = playerDirection.z < 0 ? -1 : 1;
        const signZ = playerDirection.x < 0 ? -1 : 1;
        playerDirection.x = Math.abs(playerDirection.x);
        playerDirection.z = Math.abs(playerDirection.z);
        const dx = -signX * playerDirection.z / (playerDirection.x + playerDirection.z);
        const dz = signZ * playerDirection.x / (playerDirection.x + playerDirection.z);
        this.player.startSwing(this.ball, dx, dz);
      }
    }
    
    this.player.animate();
    this.ball.update();

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