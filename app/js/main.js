import * as THREE from 'three';
import Player from './models/player';
import Driver from './models/driver';
import Iron from './models/iron';
import Wedge from './models/wedge';
import HoleOne from './models/hole_one';
import { Vector3 } from 'three';
import GolfBall from './models/golfball';
import Tee from './models/tee';
import Putter from './models/putter';

const PLAYER_SPEED = 0.04;
const PLAYER_ROTATION_SPEED = 0.002;
const PLAYER_ROTATION_SPEED_SWING = 0.001;
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
    this.iron = new Iron();
    this.wedge = new Wedge();
    this.putter = new Putter();
    this.ball = new GolfBall();
    this.tee = new Tee();

    this.player = new Player(this.camera);
    this.player.neutralPosture();
    this.player.updateClub(this.driver);
    // this.player.startWalking();
    // this.player.golfPosture(this.driver);
    // this.player.swinging = true;

    this.holeOne = new HoleOne();

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

    this.ballCoords = new Vector3();
    this.playerCoords = new Vector3();

    const _self = this;
    document.addEventListener("keydown", onKeyDown, false);
    function onKeyDown(event) {
      const keyCode = event.which;
      if (keyCode === 49) {
        _self.player.updateClub(_self.driver);
      } else if (keyCode === 50) {
        _self.player.updateClub(_self.iron);
      } else if (keyCode === 51) {
        _self.player.updateClub(_self.wedge);
      } else if (keyCode === 52) {
        _self.player.updateClub(_self.putter);
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

    this.player.getWorldPosition(this.playerCoords);
    this.holeOne.onGreen(this.playerCoords);

    this.ball.getWorldPosition(this.ballCoords);
    if (this.holeOne.insideHole(this.ballCoords, .13)) {
      this.scene.remove(this.ball);
    }

    if (this.keys.includes(87) && !this.keys.includes(83) && this.player.finishedSwing) {
      if (!this.player.walking) {
        this.player.startWalking(true);
      }
      const dx = delta * PLAYER_SPEED * Math.sin(this.player.rotation.y);
      const dz = delta * PLAYER_SPEED * Math.cos(this.player.rotation.y);
      this.player.position.x -= dx;
      this.player.position.z -= dz;
    } else if (this.keys.includes(83) && !this.keys.includes(87) && this.player.finishedSwing) {
      if (!this.player.walking) {
        this.player.startWalking(false);
      }
      const dx = delta * PLAYER_SPEED * Math.sin(this.player.rotation.y);
      const dz = delta * PLAYER_SPEED * Math.cos(this.player.rotation.y);
      this.player.position.x += dx;
      this.player.position.z += dz;
    } else {
      if (this.player.walking) {
        this.player.stopWalking();
      }
    }
    if (this.keys.includes(65)) {
      if (this.player.inGolfPosture) {
        this.player.rotation.y += PLAYER_ROTATION_SPEED_SWING * delta;
      } else {
        this.player.rotation.y += PLAYER_ROTATION_SPEED * delta;
      }
    }
    if (this.keys.includes(68)) {
      if (this.player.inGolfPosture) {
        this.player.rotation.y -= PLAYER_ROTATION_SPEED_SWING * delta;
      } else {
        this.player.rotation.y -= PLAYER_ROTATION_SPEED * delta;
      }
    }
    if (this.keys.includes(69) && this.actionUp) {
      this.actionUp = false;
      if (GAME_STATE[this.state] === 'PLACE_BALL') {

        if (this.holeOne.insideTeeBox(this.playerCoords)) {
          this.state++;
          this.tee.position.set(this.playerCoords.x, 0, this.playerCoords.z);
          this.ball.teed = true;
          this.ball.position.set(this.playerCoords.x, this.tee.getTeeHeight(), this.playerCoords.z);
          this.scene.add(this.tee);
          this.scene.add(this.ball);
        }
      } else if (GAME_STATE[this.state] === 'LIVE_BALL') {
        if (this.ball.withinRange(this.playerCoords)) {
          this.state++;
          const rotationY = this.player.rotation.y + 3 / 2 * Math.PI;
          this.player.golfPosture();
          this.player.rotation.y = rotationY
          const ballCoords = new Vector3();
          this.ball.getWorldPosition(ballCoords);
          
          this.player.position.set(ballCoords.x, 0, ballCoords.z);
        }
      } else if (GAME_STATE[this.state] === 'READY') {
        this.state--;
        this.player.startSwing(this.ball, this.player.rotation.y);
      }
    }
    if (this.player.backswing && this.actionUp) {
      this.player.startDownswing();
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